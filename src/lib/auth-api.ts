import type { NextApiRequest, NextApiResponse } from 'next'
import { parse } from 'cookie'
import { verifyToken } from '@/lib/jwt'

export function getTokenFromRequest(req: NextApiRequest): string | undefined {
  const auth = req.headers.authorization
  if (typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    const t = auth.slice(7).trim()
    if (t) return t
  }
  const raw = req.headers.cookie
  if (!raw) return undefined
  const cookies = parse(raw)
  const c = cookies.token
  return typeof c === 'string' && c.length > 0 ? c : undefined
}

/** Returns userId or null after sending 401 on failure */
export async function requireAuthApi(
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<string | null> {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      res.status(401).json({ error: 'Not authenticated' })
      return null
    }
    const { userId } = await verifyToken(token)
    return userId
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' })
    return null
  }
}

export function getBaseUrl(): string {
  if (process.env.BASE_URL) {
    return process.env.BASE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  return 'http://localhost:3000'
}
