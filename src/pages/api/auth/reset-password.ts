import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'

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
    const { token, newPassword } = req.body as {
      token?: string
      newPassword?: string
    }
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: 'Token and new password are required' })
    }
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 8 characters' })
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    })
    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset link' })
    }
    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    return res
      .status(200)
      .json({ success: true, message: 'Password has been reset' })
  } catch (e) {
    console.error('Reset-password error:', e)
    return res.status(500).json({ error: 'Could not reset password' })
  }
}
