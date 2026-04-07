import { Schema, model, models } from 'mongoose'
import bcrypt from 'bcryptjs'

export type MembershipTier = 'free' | 'stock_picks' | 'private_placements'
export type UserRole = 'user' | 'admin'

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    phone: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    membershipTier: {
      type: String,
      enum: ['free', 'stock_picks', 'private_placements'],
      default: 'free',
    },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    subscriptionStatus: { type: String },
    accreditedInvestor: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true },
)

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const pwd = this.password as string | undefined
  if (
    pwd &&
    (pwd.startsWith('$2a$') || pwd.startsWith('$2b$') || pwd.startsWith('$2y$'))
  ) {
    return next()
  }
  if (pwd) {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(pwd, salt)
  }
  next()
})

export const User = models.User || model('User', UserSchema, 'users')
