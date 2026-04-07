import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '..', '.env') })

import mongoose from 'mongoose'
import { User } from './models/User.js'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('MONGODB_URI not set in .env')
  process.exit(1)
}

const USERS = [
  {
    name: 'Admin User',
    email: 'admin@resourceinsider.com',
    password: 'admin123!',
    role: 'admin',
    membershipTier: 'private_placements',
    subscriptionStatus: 'active',
    accreditedInvestor: true,
  },
  {
    name: 'Jamie Keech',
    email: 'jamie@resourceinsider.com',
    password: 'password123!',
    role: 'admin',
    membershipTier: 'private_placements',
    subscriptionStatus: 'active',
    accreditedInvestor: true,
  },
  {
    name: 'Sarah Mitchell',
    email: 'sarah@example.com',
    password: 'password123!',
    role: 'user',
    membershipTier: 'stock_picks',
    subscriptionStatus: 'active',
    phone: '+1 604 555 0102',
    accreditedInvestor: false,
  },
  {
    name: 'David Chen',
    email: 'david@example.com',
    password: 'password123!',
    role: 'user',
    membershipTier: 'private_placements',
    subscriptionStatus: 'active',
    phone: '+1 416 555 0199',
    accreditedInvestor: true,
  },
  {
    name: 'Marcus Thompson',
    email: 'marcus@example.com',
    password: 'password123!',
    role: 'user',
    membershipTier: 'free',
    accreditedInvestor: false,
  },
  {
    name: 'Emily Rodriguez',
    email: 'emily@example.com',
    password: 'password123!',
    role: 'user',
    membershipTier: 'stock_picks',
    subscriptionStatus: 'active',
    accreditedInvestor: true,
  },
  {
    name: 'Robert Nakamura',
    email: 'robert@example.com',
    password: 'password123!',
    role: 'user',
    membershipTier: 'free',
    phone: '+61 2 5550 1234',
    accreditedInvestor: false,
  },
  {
    name: 'Lisa Chang',
    email: 'lisa@example.com',
    password: 'password123!',
    role: 'user',
    membershipTier: 'private_placements',
    subscriptionStatus: 'active',
    phone: '+1 778 555 0188',
    accreditedInvestor: true,
  },
]

async function seed() {
  await mongoose.connect(MONGODB_URI!)
  console.log('Connected to MongoDB')

  for (const data of USERS) {
    const existing = await User.findOne({ email: data.email })
    if (existing) {
      console.log(`  skip (exists): ${data.email}`)
      continue
    }
    await User.create(data)
    console.log(`  created: ${data.email} [${data.role}/${data.membershipTier}]`)
  }

  console.log('Seed complete')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed error:', err)
  process.exit(1)
})
