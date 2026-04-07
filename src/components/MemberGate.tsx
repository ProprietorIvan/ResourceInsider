import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useAuth, type MembershipTier } from '../contexts/AuthContext'
import { BtnTeal } from './shared'

const tierRank: Record<MembershipTier, number> = {
  free: 0,
  stock_picks: 1,
  private_placements: 2,
}

export default function MemberGate({
  requiredTier,
  children,
}: {
  requiredTier: 'stock_picks' | 'private_placements'
  children: ReactNode
}) {
  const { user, isLoading } = useAuth()
  if (isLoading) {
    return (
      <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-white/70">
        Checking access…
      </div>
    )
  }
  const current = user?.membershipTier ?? 'free'
  if (tierRank[current] >= tierRank[requiredTier]) {
    return <>{children}</>
  }
  const label =
    requiredTier === 'private_placements'
      ? 'Private Placements'
      : 'Stock Picks'
  return (
    <div className="rounded-lg border border-[var(--color-teal)]/40 bg-[var(--color-teal-light)] p-8 text-center">
      <h3 className="font-display text-2xl font-bold text-white not-italic">
        Members only
      </h3>
      <p className="mt-3 text-sm text-white/70">
        Upgrade to <strong className="text-white">{label}</strong> to unlock this
        content.
      </p>
      <Link to="/register" className="mt-6 inline-block">
        <BtnTeal>View membership options</BtnTeal>
      </Link>
    </div>
  )
}
