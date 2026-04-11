import { Router, type Response } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { createTransport } from 'nodemailer'
import dbConnect from '../db.js'
import { User } from '../models/User.js'
import { requireAuth, type AuthedRequest } from '../middleware/auth.js'

function getTransporter() {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER
  const pass = process.env.SMTP_PASSWORD || process.env.EMAIL_PASSWORD
  if (!user || !pass) return null
  return createTransport({ service: 'gmail', auth: { user, pass } })
}

const router = Router()

async function requireAdmin(
  req: AuthedRequest,
  res: Response,
  next: () => void,
) {
  await requireAuth(req, res, async () => {
    try {
      await dbConnect()
      const user = await User.findById(req.userId)
      if (!user || user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' })
        return
      }
      next()
    } catch {
      res.status(500).json({ error: 'Server error' })
    }
  })
}

router.get('/users', (req: AuthedRequest, res, next) => {
  void requireAdmin(req, res, async () => {
    try {
      await dbConnect()
      const users = await User.find({})
        .select('-password -resetPasswordToken -resetPasswordExpires')
        .sort({ createdAt: -1 })
      res.json({ users })
    } catch (e) {
      console.error('Admin users error:', e)
      next(e)
    }
  })
})

router.get('/stats', (req: AuthedRequest, res, next) => {
  void requireAdmin(req, res, async () => {
    try {
      await dbConnect()
      const total = await User.countDocuments()
      const free = await User.countDocuments({ membershipTier: 'free' })
      const stockPicks = await User.countDocuments({ membershipTier: 'stock_picks' })
      const privatePlacements = await User.countDocuments({ membershipTier: 'private_placements' })
      const accredited = await User.countDocuments({ accreditedInvestor: true })
      res.json({ total, free, stockPicks, privatePlacements, accredited })
    } catch (e) {
      console.error('Admin stats error:', e)
      next(e)
    }
  })
})

router.post('/users/:id/set-password', (req: AuthedRequest, res, next) => {
  void requireAdmin(req, res, async () => {
    try {
      await dbConnect()
      const { password, sendEmail } = req.body as { password?: string; sendEmail?: boolean }
      if (!password || password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters' })
        return
      }
      const user = await User.findById(req.params.id)
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
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
                <p>Please log in at <a href="${process.env.BASE_URL || 'https://resource-insider.vercel.app'}/login">resource-insider.vercel.app/login</a> and change your password immediately.</p>
              `,
            })
          } catch (err) {
            console.error('Admin set-password email error:', err)
          }
        }
      }

      res.json({ success: true })
    } catch (e) {
      console.error('Admin set-password error:', e)
      next(e)
    }
  })
})

router.post('/users/:id/send-email', (req: AuthedRequest, res, next) => {
  void requireAdmin(req, res, async () => {
    try {
      await dbConnect()
      const { subject, body } = req.body as { subject?: string; body?: string }
      if (!subject || !body) {
        res.status(400).json({ error: 'Subject and body are required' })
        return
      }
      const user = await User.findById(req.params.id)
      if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
      }
      const transporter = getTransporter()
      const fromEmail = process.env.SMTP_FROM || process.env.SMTP_USER
      if (!transporter || !fromEmail) {
        res.status(500).json({ error: 'Email not configured' })
        return
      }
      await transporter.sendMail({
        from: `"Resource Insider" <${fromEmail}>`,
        to: user.email,
        subject,
        html: `<p>${body.replace(/\n/g, '<br>')}</p>`,
      })
      res.json({ success: true })
    } catch (e) {
      console.error('Admin send-email error:', e)
      next(e)
    }
  })
})

export default router
