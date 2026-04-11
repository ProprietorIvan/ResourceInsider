import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { createTransport } from 'nodemailer'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import { getBaseUrl } from '@/lib/auth-api'

function getTransporter() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER
  const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD
  if (!user || !pass) {
    return null
  }
  return createTransport({
    service: 'gmail',
    auth: { user, pass },
  })
}

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
    const { email: rawEmail } = req.body as { email?: string }
    const email =
      typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }
    const user = await User.findOne({ email })
    const msg =
      'If an account exists for that email, a password reset link has been sent.'
    if (!user) {
      return res.status(200).json({ message: msg })
    }
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = resetToken
    user.resetPasswordExpires = new Date(Date.now() + 3600000)
    await user.save()
    const resetUrl = `${getBaseUrl()}/reset-password?token=${resetToken}`
    const transporter = getTransporter()
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER
    if (transporter && fromEmail) {
      try {
        await transporter.sendMail({
          from: `"Resource Insider" <${fromEmail}>`,
          to: user.email,
          subject: 'Reset your Resource Insider password',
          html: `
            <p>Hello,</p>
            <p>We received a request to reset your password.</p>
            <p><a href="${resetUrl}">Reset your password</a></p>
            <p>This link expires in 1 hour. If you did not request this, ignore this email.</p>
            <p>${resetUrl}</p>
          `,
        })
      } catch (err) {
        console.error('Forgot-password email error:', err)
      }
    } else {
      console.warn('SMTP not configured; reset link (dev):', resetUrl)
    }
    return res.status(200).json({ message: msg })
  } catch (e) {
    console.error('Forgot-password error:', e)
    return res.status(500).json({ error: 'Something went wrong' })
  }
}
