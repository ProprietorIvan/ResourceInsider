import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { createTransport } from 'nodemailer'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import { requireAuthApi } from '@/lib/auth-api'
import { getBaseUrl } from '@/lib/auth-api'

function getTransporter() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER
  const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD
  if (!user || !pass) return null
  return createTransport({ service: 'gmail', auth: { user, pass } })
}

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
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST'])
    return res.status(405).json({ error: 'Method not allowed' })
  }
  const ok = await requireAdmin(req, res)
  if (!ok) return
  const id = req.query.id
  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid id' })
  }
  try {
    await dbConnect()
    const { password, sendEmail } = req.body as {
      password?: string
      sendEmail?: boolean
    }
    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters' })
    }
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const hashed = await bcrypt.hash(password, 10)
    user.password = hashed
    await user.save()

    if (sendEmail) {
      const transporter = getTransporter()
      const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER
      if (transporter && fromEmail) {
        try {
          await transporter.sendMail({
            from: `"Resource Insider" <${fromEmail}>`,
            to: user.email,
            subject: 'Your Resource Insider password has been updated',
            html: `
                <p>Hello ${user.name},</p>
                <p>An administrator has set a new password for your Resource Insider account.</p>
                <p><strong>New password:</strong> ${password}</p>
                <p>Please log in at <a href="${getBaseUrl()}/login">${getBaseUrl()}/login</a> and change your password immediately.</p>
              `,
          })
        } catch (err) {
          console.error('Admin set-password email error:', err)
        }
      }
    }

    return res.status(200).json({ success: true })
  } catch (e) {
    console.error('Admin set-password error:', e)
    return res.status(500).json({ error: 'Server error' })
  }
}
