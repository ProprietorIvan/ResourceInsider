import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import { requireAuthApi } from '@/lib/auth-api'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const userId = await requireAuthApi(req, res)
  if (!userId) return
  try {
    await dbConnect()
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    return res.status(200).json({
      membershipTier: user.membershipTier,
      subscriptionStatus: user.subscriptionStatus,
      stripeSubscriptionId: user.stripeSubscriptionId,
    })
  } catch (e) {
    console.error('subscription get error:', e)
    return res.status(500).json({ error: 'Failed to load subscription' })
  }
}
