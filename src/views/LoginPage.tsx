import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react'
import { SITE_PAD_X } from '@/lib/site-shell'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const from =
    typeof router.query.from === 'string' && router.query.from.startsWith('/')
      ? router.query.from
      : '/members'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // Full page reload so middleware + AuthContext pick up the new session cookie
        window.location.href = from
      } else {
        setError(data?.error || 'Invalid credentials')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`flex min-h-screen items-center justify-center bg-[var(--color-navy)] ${SITE_PAD_X}`}>
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-[var(--color-teal)]" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm">Access your member dashboard</p>
        </div>

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-xl bg-red-50 p-4">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="pl-10 w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-500 text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-10 w-full px-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-500 text-gray-900"
              />
            </div>
            <div className="mt-1 text-right">
              <Link
                href="/forgot-password"
                className="text-sm text-[var(--color-teal)] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium text-white bg-[var(--color-teal)] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-teal)] transition-opacity ${
              loading ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in…
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Sign in
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          No account?{' '}
          <Link href="/register" className="font-semibold text-[var(--color-teal)] hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  )
}
