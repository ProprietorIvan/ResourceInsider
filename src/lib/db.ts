import mongoose from 'mongoose'
import dotenv from 'dotenv'
import path from 'path'

function refreshEnvFromFile(): void {
  if (process.env.NODE_ENV === 'production') return
  dotenv.config({ path: path.join(process.cwd(), '.env') })
}

function getMongoUri(): string | undefined {
  const raw = process.env.MONGODB_URI
  return typeof raw === 'string' ? raw.replace(/^["']|["']$/g, '').trim() : undefined
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }
global.mongooseCache = cache

export default async function dbConnect(): Promise<typeof mongoose> {
  refreshEnvFromFile()
  const uri = getMongoUri()
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }
  if (cache.conn) {
    return cache.conn
  }
  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
    })
  }
  try {
    cache.conn = await cache.promise
  } catch (e) {
    cache.promise = null
    throw e
  }
  return cache.conn
}
