import path from 'path'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

dotenv.config({ path: path.join(process.cwd(), '.env') })

const rawUri = process.env.MONGODB_URI?.replace(/^["']|["']$/g, '').trim()
if (!rawUri) {
  console.error('FAIL: MONGODB_URI is empty or missing in .env')
  process.exit(1)
}

async function main() {
  console.log('Connecting…')
  await mongoose.connect(rawUri)
  const db = mongoose.connection.db
  if (!db) {
    throw new Error('No database handle after connect')
  }
  console.log('OK connected. Database:', db.databaseName)

  const cols = await db.listCollections().toArray()
  console.log('Collections:', cols.map((c) => c.name).sort().join(', ') || '(none yet)')

  const users = db.collection('users')
  const count = await users.countDocuments()
  console.log('users count:', count)

  const sample = await users
    .find({}, { projection: { email: 1, role: 1, membershipTier: 1, name: 1 } })
    .limit(5)
    .toArray()
  console.log('First users (up to 5):')
  for (const u of sample) {
    console.log('  -', u.email, '|', u.role || 'user', '|', u.membershipTier || 'free')
  }

  await mongoose.disconnect()
  console.log('Disconnected. Database check passed.')
}

main().catch((err) => {
  console.error('FAIL:', err instanceof Error ? err.message : err)
  process.exit(1)
})
