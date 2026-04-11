import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyJwtHs256 } from '@/lib/jwt-edge'

const publicExact = new Set([
  '/',
  '/join',
  '/blog',
  '/login',
  '/register',
  '/register/success',
  '/forgot-password',
  '/reset-password',
])

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/_next') || pathname.startsWith('/favicon')) {
    return NextResponse.next()
  }

  if (publicExact.has(pathname)) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/blog/')) {
    return NextResponse.next()
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return NextResponse.next()
  }

  const token = request.cookies.get('token')?.value
  if (!token) {
    const login = new URL('/login', request.url)
    login.searchParams.set('from', pathname)
    return NextResponse.redirect(login)
  }

  try {
    await verifyJwtHs256(token, secret)
    return NextResponse.next()
  } catch {
    const login = new URL('/login', request.url)
    login.searchParams.set('from', pathname)
    return NextResponse.redirect(login)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
