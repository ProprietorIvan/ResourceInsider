import { SignJWT, jwtVerify } from 'jose'

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET
  if (!s) {
    throw new Error('JWT_SECRET is not configured')
  }
  return new TextEncoder().encode(s)
}

export async function signToken(userId: string): Promise<string> {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('30d')
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<{ userId: string }> {
  const { payload } = await jwtVerify(token, getSecret())
  const userId = payload.userId
  if (typeof userId !== 'string') {
    throw new Error('Invalid token payload')
  }
  return { userId }
}
