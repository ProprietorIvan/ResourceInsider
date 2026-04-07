import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.js'

export function getTokenFromRequest(req: Request): string | undefined {
  const auth = req.headers.authorization
  if (typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    const t = auth.slice(7).trim()
    if (t) return t
  }
  const c = req.cookies?.token
  return typeof c === 'string' && c.length > 0 ? c : undefined
}

export interface AuthedRequest extends Request {
  userId?: string
}

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = getTokenFromRequest(req)
    if (!token) {
      res.status(401).json({ error: 'Not authenticated' })
      return
    }
    const { userId } = await verifyToken(token)
    req.userId = userId
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}

export async function optionalAuth(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = getTokenFromRequest(req)
    if (token) {
      const { userId } = await verifyToken(token)
      req.userId = userId
    }
  } catch {
    // ignore invalid token for optional auth
  }
  next()
}
