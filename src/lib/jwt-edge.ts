/**
 * HS256 JWT verify for Edge Middleware (Web Crypto only — no jose).
 * Must stay in sync with `signToken` in jwt.ts (alg HS256, payload.userId).
 */
export async function verifyJwtHs256(
  token: string,
  secret: string
): Promise<{ userId: string }> {
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token')
  const [headerB64, payloadB64, signatureB64] = parts

  const data = new TextEncoder().encode(`${headerB64}.${payloadB64}`)
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const sig = new Uint8Array(base64UrlToBytes(signatureB64))
  const ok = await crypto.subtle.verify('HMAC', key, sig, data)
  if (!ok) throw new Error('Bad signature')

  const payloadJson = new TextDecoder().decode(base64UrlToBytes(payloadB64))
  const payload = JSON.parse(payloadJson) as Record<string, unknown>
  if (typeof payload.userId !== 'string') throw new Error('Invalid payload')

  if (typeof payload.exp === 'number' && payload.exp * 1000 < Date.now()) {
    throw new Error('Expired')
  }

  return { userId: payload.userId }
}

function base64UrlToBytes(s: string): Uint8Array {
  let b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  const pad = b64.length % 4
  if (pad) b64 += '='.repeat(4 - pad)
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}
