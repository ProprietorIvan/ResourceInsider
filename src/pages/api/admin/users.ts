import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import { requireAuthApi } from '@/lib/auth-api'

async function requireAdmin(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string | null> {
  const userId = await requireAuthApi(req, res)
  if (!userId) return null
  await dbConnect()
  const user = await User.findById(userId)
  if (!user || user.role !== 'admin') {
    res.status(403).json({ error: 'Admin access required' })
    return null
  }
  return userId
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
    const users = await User.find({})
      .select('-password -resetPasswordToken -resetPasswordExpires')
      .sort({ createdAt: -1 })
    return res.status(200).json({ users })
  } catch (e) {
    console.error('Admin users error:', e)
    return res.status(500).json({ error: 'Server error' })
  }
}
