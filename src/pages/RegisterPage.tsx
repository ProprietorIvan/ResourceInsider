import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BtnTeal } from '../components/shared'

type Step = 1 | 2
type SelectedTier = 'free' | 'stock_picks' | 'private_placements'

export default function RegisterPage() {
  const { register } = useAuth()
  const [step, setStep] = useState<Step>(1)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [accreditedInvestor, setAccreditedInvestor] = useState(false)
  const [tier, setTier] = useState<SelectedTier>('free')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleStep1(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setStep(2)
  }

  async function handleComplete() {
    setError('')
    setSubmitting(true)
    try {
      await register({
        name,
        email,
        password,
        phone,
        accreditedInvestor,
      })
      if (tier === 'free') {
        window.location.href = '/members'
        return
      }
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not start checkout')
      }
      window.location.href = data.url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="bg-[var(--color-navy)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display text-3xl font-bold text-white not-italic md:text-4xl">
          Join Resource Insider
        </h1>
        <p className="mt-2 text-white/60">
          Create your account, then choose a membership. Paid plans use secure Stripe Checkout.
        </p>

        <div className="mt-8 flex gap-2 text-sm text-white/50">
          <span className={step === 1 ? 'font-semibold text-[var(--color-teal)]' : ''}>
            1. Account
          </span>
          <span>/</span>
          <span className={step === 2 ? 'font-semibold text-[var(--color-teal)]' : ''}>
            2. Membership
          </span>
        </div>

        {error ? (
          <p className="mt-4 rounded border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
            {error}
          </p>
        ) : null}

        {step === 1 ? (
          <form
            className="mt-6 space-y-4 rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-8"
            onSubmit={handleStep1}
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Full name
                </label>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Email
                </label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Password
                </label>
                <input
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-white/50">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded border border-white/20 bg-white/10 px-3 py-2.5 text-white"
                />
              </div>
              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  id="accredited"
                  type="checkbox"
                  checked={accreditedInvestor}
                  onChange={(e) => setAccreditedInvestor(e.target.checked)}
                  className="h-4 w-4 rounded border-white/30"
                />
                <label htmlFor="accredited" className="text-sm text-white/80">
                  I am an accredited investor (self-declared)
                </label>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <BtnTeal type="submit">Continue to membership</BtnTeal>
              <Link
                to="/login"
                className="inline-flex items-center px-4 text-sm text-[var(--color-teal)] hover:underline"
              >
                Already have an account?
              </Link>
            </div>
          </form>
        ) : (
          <div className="mt-6 space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <button
                type="button"
                onClick={() => setTier('free')}
                className={`rounded-xl border p-6 text-left transition ${
                  tier === 'free'
                    ? 'border-[var(--color-teal)] bg-[var(--color-teal-light)]'
                    : 'border-white/10 bg-[var(--color-navy-light)]/80 hover:border-white/20'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-teal)]">
                  Free
                </p>
                <p className="mt-2 font-display text-xl font-bold text-white not-italic">
                  Newsletter
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Account + list updates. Upgrade anytime.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setTier('stock_picks')}
                className={`rounded-xl border p-6 text-left transition ${
                  tier === 'stock_picks'
                    ? 'border-[var(--color-teal)] bg-[var(--color-teal-light)]'
                    : 'border-white/10 bg-[var(--color-navy-light)]/80 hover:border-white/20'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-teal)]">
                  Stock Picks
                </p>
                <p className="mt-2 font-display text-xl font-bold text-white not-italic">
                  Member
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Curated public company research & picks (Stripe subscription).
                </p>
              </button>
              <button
                type="button"
                onClick={() => setTier('private_placements')}
                className={`rounded-xl border p-6 text-left transition ${
                  tier === 'private_placements'
                    ? 'border-[var(--color-teal)] bg-[var(--color-teal-light)]'
                    : 'border-white/10 bg-[var(--color-navy-light)]/80 hover:border-white/20'
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--color-teal)]">
                  Private Placements
                </p>
                <p className="mt-2 font-display text-xl font-bold text-white not-italic">
                  Member
                </p>
                <p className="mt-2 text-sm text-white/60">
                  Deal flow & placement coverage (Stripe subscription).
                </p>
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <BtnTeal type="button" disabled={submitting} onClick={() => void handleComplete()}>
                {submitting
                  ? 'Working…'
                  : tier === 'free'
                    ? 'Complete signup'
                    : 'Continue to payment'}
              </BtnTeal>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
