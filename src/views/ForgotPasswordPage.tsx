import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { BtnTeal } from '@/components/shared'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = (await res.json()) as { message?: string; error?: string }
      if (!res.ok) {
        setError(data.error || 'Something went wrong')
        return
      }
      setMessage(data.message || 'Check your email for reset instructions.')
    } catch {
      setError('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="bg-[var(--color-navy)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto w-full max-w-md rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-8">
        <h1 className="font-display text-3xl font-bold text-white not-italic">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Enter your email and we&apos;ll send a link to reset your password.
        </p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error ? (
            <p className="rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="rounded border border-[var(--color-teal)]/40 bg-[var(--color-teal-light)] px-3 py-2 text-sm text-white/90">
              {message}
            </p>
          ) : null}
          <div>
            <label htmlFor="forgot-email" className="block text-xs font-semibold uppercase tracking-wider text-white/50">
              Email
            </label>
            <input
              id="forgot-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-white"
            />
          </div>
          <BtnTeal type="submit" className="w-full justify-center" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </BtnTeal>
        </form>
        <p className="mt-6 text-center text-sm">
          <Link href="/login" className="text-[var(--color-teal)] hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  )
}
