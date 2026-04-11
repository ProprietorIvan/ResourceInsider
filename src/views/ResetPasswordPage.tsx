import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { BtnTeal } from '@/components/shared'
import { SITE_SHELL_X } from '@/lib/site-shell'

export default function ResetPasswordPage() {
  const router = useRouter()
  const token =
    typeof router.query.token === 'string' ? router.query.token : ''
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (!token) {
      setError('Invalid or missing reset link')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      })
      const data = (await res.json()) as { error?: string }
      if (!res.ok) {
        setError(data.error || 'Could not reset password')
        return
      }
      void router.replace('/login')
    } catch {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className={`bg-[var(--color-navy)] py-16 md:py-24 ${SITE_SHELL_X}`}>
      <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-8">
        <h1 className="font-display text-3xl font-bold text-white not-italic">New password</h1>
        {!router.isReady ? (
          <p className="mt-4 text-sm text-white/60">Loading…</p>
        ) : !token ? (
          <p className="mt-4 text-sm text-red-200">
            This link is invalid. Request a new reset from{' '}
            <Link href="/forgot-password" className="underline">
              forgot password
            </Link>
            .
          </p>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {error ? (
              <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">{error}</p>
            ) : null}
            <div>
              <label htmlFor="new-pass" className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                New password
              </label>
              <input
                id="new-pass"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-white"
              />
            </div>
            <div>
              <label htmlFor="confirm-pass" className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                Confirm password
              </label>
              <input
                id="confirm-pass"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-white"
              />
            </div>
            <BtnTeal type="submit" className="w-full justify-center" disabled={submitting}>
              {submitting ? 'Saving…' : 'Update password'}
            </BtnTeal>
          </form>
        )}
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-[var(--color-teal)] hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  )
}
