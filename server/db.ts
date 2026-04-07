import mongoose from 'mongoose'

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongooseCache: MongooseCache | undefined
}

const cache: MongooseCache = global.mongooseCache ?? { conn: null, promise: null }
if (process.env.NODE_ENV !== 'production') {
  global.mongooseCache = cache
}

export default async function dbConnect(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI
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
