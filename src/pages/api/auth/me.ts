import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import { requireAuthApi } from '@/lib/auth-api'
import { clearTokenCookie } from '@/lib/cookies'

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
      clearTokenCookie(res)
      return res.status(401).json({ error: 'User not found' })
    }
    return res.status(200).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user',
      membershipTier: user.membershipTier,
      subscriptionStatus: user.subscriptionStatus,
      accreditedInvestor: user.accreditedInvestor,
    })
  } catch (e) {
    console.error('Me error:', e)
    return res.status(500).json({ error: 'Failed to load profile' })
  }
}
