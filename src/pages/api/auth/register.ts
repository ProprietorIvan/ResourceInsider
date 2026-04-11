import type { NextApiRequest, NextApiResponse } from 'next'
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
    const { name, email: rawEmail, password, phone, accreditedInvestor } =
      req.body as {
        name?: string
        email?: string
        password?: string
        phone?: string
        accreditedInvestor?: boolean
      }
    const email =
      typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Name, email, and password are required' })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters' })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' })
    }
    const user = await User.create({
      name,
      email,
      password,
      phone: typeof phone === 'string' ? phone : '',
      accreditedInvestor: Boolean(accreditedInvestor),
      membershipTier: 'free',
    })
    const token = await signToken(user._id.toString())
    setTokenCookie(res, token)
    return res.status(201).json({
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
    console.error('Register error:', e)
    return res.status(500).json({ error: 'Registration failed' })
  }
}
