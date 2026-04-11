import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import { requireAuthApi } from '@/lib/auth-api'
import { getBaseUrl } from '@/lib/auth-api'

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const userId = await requireAuthApi(req, res)
  if (!userId) return
  try {
    const { tier } = req.body as { tier?: string }
    if (tier !== 'stock_picks' && tier !== 'private_placements') {
      return res.status(400).json({ error: 'Invalid tier' })
    }
    const priceId = priceIdForTier(tier)
    if (!priceId) {
      return res.status(500).json({ error: 'Stripe price not configured for tier' })
    }
    await dbConnect()
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
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
    const baseUrl = getBaseUrl()
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
      return res.status(500).json({ error: 'Could not create checkout session' })
    }
    return res.status(200).json({ url: session.url })
  } catch (e) {
    console.error('create-checkout error:', e)
    return res.status(500).json({ error: 'Checkout failed' })
  }
}
