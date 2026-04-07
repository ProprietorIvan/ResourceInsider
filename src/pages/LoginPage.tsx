import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BtnTeal } from '../components/shared'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: string } | null)?.from || '/members'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="bg-[var(--color-navy)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-8 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl font-bold text-white not-italic md:text-4xl">
          Log in
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Access your member dashboard and gated research.
        </p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          <div>
            <label htmlFor="login-email" className="block text-xs font-semibold uppercase tracking-wider text-white/50">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/40"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="login-password" className="block text-xs font-semibold uppercase tracking-wider text-white/50">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-white placeholder:text-white/40"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <Link
              to="/forgot-password"
              className="text-[var(--color-teal)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <BtnTeal type="submit" className="w-full justify-center" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </BtnTeal>
        </form>
        <p className="mt-6 text-center text-sm text-white/60">
          No account?{' '}
          <Link to="/register" className="font-semibold text-[var(--color-teal)] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </main>
  )
}
