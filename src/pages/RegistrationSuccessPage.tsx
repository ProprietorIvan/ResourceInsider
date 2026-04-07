import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { BtnTeal } from '../components/shared'

export default function RegistrationSuccessPage() {
  const { refreshUser } = useAuth()

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  return (
    <main className="bg-[var(--color-navy)] px-5 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-lg rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-8 text-center">
        <h1 className="font-display text-3xl font-bold text-white not-italic">
          You&apos;re all set
        </h1>
        <p className="mt-4 text-white/70">
          Thanks for subscribing. If you just finished checkout, your membership may take a few
          seconds to activate—refresh your dashboard if needed.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/members">
            <BtnTeal className="w-full justify-center sm:w-auto">Go to member dashboard</BtnTeal>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded border border-white/20 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/5"
          >
            Home
          </Link>
        </div>
      </div>
    </main>
  )
}
