import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import { requireAuthApi } from '@/lib/auth-api'

async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<boolean> {
  const userId = await requireAuthApi(req, res)
  if (!userId) return false
  await dbConnect()
  const user = await User.findById(userId)
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' })
    return false
  }
  return true
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const ok = await requireAdmin(req, res)
  if (!ok) return
  try {
    await dbConnect()
    const total = await User.countDocuments()
    const free = await User.countDocuments({ membershipTier: 'free' })
    const stockPicks = await User.countDocuments({
      membershipTier: 'stock_picks',
    })
    const privatePlacements = await User.countDocuments({
      membershipTier: 'private_placements',
    })
    const accredited = await User.countDocuments({ accreditedInvestor: true })
    return res.status(200).json({
      total,
      free,
      stockPicks,
      privatePlacements,
      accredited,
    })
  } catch (e) {
    console.error('Admin stats error:', e)
    return res.status(500).json({ error: 'Server error' })
  }
}
