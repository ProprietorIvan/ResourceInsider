import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import { signToken } from '@/lib/jwt'
import { setTokenCookie } from '@/lib/cookies'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }
  try {
    await dbConnect()
    const { email: rawEmail, password } = req.body as {
      email?: string
      password?: string
    }
    const email =
      typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const user = await User.findOne({ email })
    if (!user || !user.password) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }
    const token = await signToken(user._id.toString())
    setTokenCookie(res, token)
    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        membershipTier: user.membershipTier,
        subscriptionStatus: user.subscriptionStatus,
      },
    })
  } catch (e) {
    console.error('Login error:', e)
    return res.status(500).json({ error: 'Authentication failed' })
  }
}
