import type { NextApiRequest, NextApiResponse } from 'next'
import { createTransport } from 'nodemailer'
import dbConnect from '@/lib/db'
import { User } from '@/lib/models/User'
import { requireAuthApi } from '@/lib/auth-api'

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
    const { subject, body } = req.body as { subject?: string; body?: string }
    if (!subject || !body) {
      return res.status(400).json({ error: 'Subject and body are required' })
    }
    const user = await User.findById(id)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    const transporter = getTransporter()
    const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER
    if (!transporter || !fromEmail) {
      return res.status(500).json({ error: 'Email not configured' })
    }
    await transporter.sendMail({
      from: `"Resource Insider" <${fromEmail}>`,
      to: user.email,
      subject,
      html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
    })
    return res.status(200).json({ success: true })
  } catch (e) {
    console.error('Admin send-email error:', e)
    return res.status(500).json({ error: 'Server error' })
  }
}
