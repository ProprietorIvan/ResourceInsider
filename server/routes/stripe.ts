import { Router, type Request, type Response } from 'express'
import Stripe from 'stripe'
import dbConnect from '../db.js'
import { User } from '../models/User.js'
import { requireAuth, type AuthedRequest } from '../middleware/auth.js'
import type { MembershipTier } from '../models/User.js'

const router = Router()

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(key)
}

function priceIdForTier(tier: string): string | undefined {
  if (tier === 'stock_picks') return process.env.STRIPE_STOCK_PICKS_PRICE_ID
  if (tier === 'private_placements')
    return process.env.STRIPE_PRIVATE_PLACEMENTS_PRICE_ID
  return undefined
}

router.post(
  '/create-checkout',
  requireAuth,
  async (req: AuthedRequest, res: Response) => {
    try {
      const { tier } = req.body as { tier?: string }
      if (tier !== 'stock_picks' && tier !== 'private_placements') {
        res.status(400).json({ error: 'Invalid tier' })
        return
      }
      const priceId = priceIdForTier(tier)
      if (!priceId) {
        res.status(500).json({ error: 'Stripe price not configured for tier' })
        return
      }
      await dbConnect()
      const user = await User.findById(req.userId)
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }
      const stripe = getStripe()
      let customerId = user.stripeCustomerId
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: user._id.toString() },
        })
        customerId = customer.id
        user.stripeCustomerId = customerId
        await user.save()
      }
      const baseUrl = process.env.BASE_URL || 'http://localhost:5173'
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${baseUrl}/register/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/register`,
        metadata: {
          userId: user._id.toString(),
          membershipTier: tier,
        },
        subscription_data: {
          metadata: {
            userId: user._id.toString(),
            membershipTier: tier,
          },
        },
      })
      if (!session.url) {
        res.status(500).json({ error: 'Could not create checkout session' })
        return
      }
      res.json({ url: session.url })
    } catch (e) {
      console.error('create-checkout error:', e)
      res.status(500).json({ error: 'Checkout failed' })
    }
  },
)

router.get(
  '/subscription',
  requireAuth,
  async (req: AuthedRequest, res: Response) => {
    try {
      await dbConnect()
      const user = await User.findById(req.userId)
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }
      res.json({
        membershipTier: user.membershipTier,
        subscriptionStatus: user.subscriptionStatus,
        stripeSubscriptionId: user.stripeSubscriptionId,
      })
    } catch (e) {
      console.error('subscription get error:', e)
      res.status(500).json({ error: 'Failed to load subscription' })
    }
  },
)

router.post('/portal', requireAuth, async (req: AuthedRequest, res: Response) => {
  try {
    await dbConnect()
    const user = await User.findById(req.userId)
    if (!user?.stripeCustomerId) {
      res.status(400).json({ error: 'No billing account on file' })
      return
    }
    const stripe = getStripe()
    const baseUrl = process.env.BASE_URL || 'http://localhost:5173'
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/members`,
    })
    res.json({ url: portal.url })
  } catch (e) {
    console.error('portal error:', e)
    res.status(500).json({ error: 'Could not open billing portal' })
  }
})

export async function handleStripeWebhook(
  req: Request,
  res: Response,
): Promise<void> {
  const sig = req.headers['stripe-signature']
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!whSecret || typeof sig !== 'string') {
    res.status(400).send('Webhook misconfigured')
    return
  }
  let event: Stripe.Event
  try {
    const stripe = getStripe()
    const raw = req.body as Buffer
    event = stripe.webhooks.constructEvent(raw, sig, whSecret)
  } catch (err) {
    console.error('Webhook signature error:', err)
    res.status(400).send('Invalid signature')
    return
  }
  try {
    await dbConnect()
    const stripe = getStripe()
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        let tier = session.metadata?.membershipTier as MembershipTier | undefined
        const subRaw = session.subscription
        const subId =
          typeof subRaw === 'string' ? subRaw : subRaw?.id ?? null
        if (subId && !tier) {
          const sub = await stripe.subscriptions.retrieve(subId)
          tier = sub.metadata?.membershipTier as MembershipTier | undefined
        }
        if (
          userId &&
          tier &&
          (tier === 'stock_picks' || tier === 'private_placements') &&
          subId
        ) {
          await User.findByIdAndUpdate(userId, {
            membershipTier: tier,
            stripeSubscriptionId: subId,
            subscriptionStatus: 'active',
          })
        }
        break
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId
        if (!userId) break
        const status = sub.status
        const map: Record<string, string> = {
          active: 'active',
          past_due: 'past_due',
          canceled: 'canceled',
          unpaid: 'unpaid',
          trialing: 'trialing',
        }
        await User.findByIdAndUpdate(userId, {
          subscriptionStatus: map[status] || status,
          stripeSubscriptionId: sub.id,
        })
        break
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        const userId = sub.metadata?.userId
        if (!userId) break
        await User.findByIdAndUpdate(userId, {
          membershipTier: 'free',
          stripeSubscriptionId: undefined,
          subscriptionStatus: 'canceled',
        })
        break
      }
      default:
        break
    }
    res.json({ received: true })
  } catch (e) {
    console.error('Webhook handler error:', e)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
}

export default router
