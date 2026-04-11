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
    await dbConnect()
    const user = await User.findById(userId)
    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'No billing account on file' })
    }
    const stripe = getStripe()
    const baseUrl = getBaseUrl()
    const portal = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/members`,
    })
    return res.status(200).json({ url: portal.url })
  } catch (e) {
    console.error('portal error:', e)
    return res.status(500).json({ error: 'Could not open billing portal' })
  }
}
