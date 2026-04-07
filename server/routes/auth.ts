import { Router, type Response } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { createTransport } from 'nodemailer'
import dbConnect from '../db.js'
import { User } from '../models/User.js'
import { signToken } from '../utils/jwt.js'
import { requireAuth, type AuthedRequest } from '../middleware/auth.js'

const router = Router()

const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

function setTokenCookie(res: Response, token: string): void {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: thirtyDaysMs,
    path: '/',
  })
}

function clearTokenCookie(res: Response): void {
  res.clearCookie('token', {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

function getBaseUrl(): string {
  return process.env.BASE_URL || 'http://localhost:5173'
}

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

router.post('/register', async (req, res) => {
  try {
    await dbConnect()
    const { name, email: rawEmail, password, phone, accreditedInvestor } = req.body as {
      name?: string
      email?: string
      password?: string
      phone?: string
      accreditedInvestor?: boolean
    }
    const email =
      typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' })
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email format' })
      return
    }
    if (password.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' })
      return
    }
    const existing = await User.findOne({ email })
    if (existing) {
      res.status(400).json({ error: 'Email already registered' })
      return
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
    res.status(201).json({
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
    res.status(500).json({ error: 'Registration failed' })
  }
})

router.post('/login', async (req, res) => {
  try {
    await dbConnect()
    const { email: rawEmail, password } = req.body as {
      email?: string
      password?: string
    }
    const email =
      typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' })
      return
    }
    const user = await User.findOne({ email })
    if (!user || !user.password) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    const token = await signToken(user._id.toString())
    setTokenCookie(res, token)
    res.json({
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
    res.status(500).json({ error: 'Authentication failed' })
  }
})

router.post('/logout', (_req, res) => {
  clearTokenCookie(res)
  res.json({ success: true })
})

router.post('/forgot-password', async (req, res) => {
  try {
    await dbConnect()
    const { email: rawEmail } = req.body as { email?: string }
    const email =
      typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : ''
    if (!email) {
      res.status(400).json({ error: 'Email is required' })
      return
    }
    const user = await User.findOne({ email })
    const msg =
      'If an account exists for that email, a password reset link has been sent.'
    if (!user) {
      res.json({ message: msg })
      return
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
    res.json({ message: msg })
  } catch (e) {
    console.error('Forgot-password error:', e)
    res.status(500).json({ error: 'Something went wrong' })
  }
})

router.post('/reset-password', async (req, res) => {
  try {
    await dbConnect()
    const { token, newPassword } = req.body as {
      token?: string
      newPassword?: string
    }
    if (!token || !newPassword) {
      res.status(400).json({ error: 'Token and new password are required' })
      return
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: 'Password must be at least 8 characters' })
      return
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    })
    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset link' })
      return
    }
    user.password = newPassword
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined
    await user.save()
    res.json({ success: true, message: 'Password has been reset' })
  } catch (e) {
    console.error('Reset-password error:', e)
    res.status(500).json({ error: 'Could not reset password' })
  }
})

router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  try {
    await dbConnect()
    const user = await User.findById(req.userId)
    if (!user) {
      clearTokenCookie(res)
      res.status(401).json({ error: 'User not found' })
      return
    }
    res.json({
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
    res.status(500).json({ error: 'Failed to load profile' })
  }
})

export default router
