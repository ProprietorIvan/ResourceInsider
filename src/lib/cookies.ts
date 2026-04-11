import type { NextApiResponse } from 'next'
import { serialize } from 'cookie'

const thirtyDaysSec = 30 * 24 * 60 * 60

export function setTokenCookie(res: NextApiResponse, token: string): void {
  res.setHeader(
    'Set-Cookie',
    serialize('token', token, {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: thirtyDaysSec,
    }),
  )
}

export function clearTokenCookie(res: NextApiResponse): void {
  res.setHeader(
    'Set-Cookie',
    serialize('token', '', {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    }),
  )
}
