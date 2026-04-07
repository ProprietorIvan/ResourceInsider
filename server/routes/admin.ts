import { Router, type Response } from 'express'
import dbConnect from '../db.js'
import { User } from '../models/User.js'
import { requireAuth, type AuthedRequest } from '../middleware/auth.js'

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

export default router
