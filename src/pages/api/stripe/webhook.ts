import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import type { MembershipTier } from '@/lib/models/User'

export const config = {
  api: {
    bodyParser: false,
  },
}

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(key)
}

function readRawBody(req: NextApiRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).end('Method not allowed')
  }
  const sig = req.headers['stripe-signature']
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!whSecret || typeof sig !== 'string') {
    return res.status(400).send('Webhook misconfigured')
  }
  let event: Stripe.Event
  try {
    const stripe = getStripe()
    const raw = await readRawBody(req)
    event = stripe.webhooks.constructEvent(raw, sig, whSecret)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return res.status(400).send('Invalid signature')
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
    return res.status(200).json({ received: true })
  } catch (e) {
    console.error('Webhook handler error:', e)
    return res.status(500).json({ error: 'Webhook handler failed' })
  }
}
