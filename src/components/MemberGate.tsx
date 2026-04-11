import type { ReactNode } from 'react'
import Link from 'next/link'
import { Lock } from 'lucide-react'
import { useAuth, type MembershipTier } from '@/contexts/AuthContext'
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
      <div className="glass-card rounded-xl p-8 text-center text-white/60">
        <p className="text-sm font-medium">Verifying access…</p>
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
    <div className="glow-border glow-border--teal relative overflow-hidden rounded-xl">
      <div className="glass-card relative rounded-[inherit] px-8 py-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-[var(--color-teal)] shadow-[0_0_28px_-6px_rgba(0,152,166,0.45)]">
          <Lock className="h-6 w-6" strokeWidth={1.75} />
        </div>
        <h3 className="mt-6 font-display text-2xl font-bold text-white not-italic">
          Beyond this door
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/65">
          This archive is reserved for{' '}
          <strong className="text-white">{label}</strong> members—the same
          research stack, with the vault unlocked.
        </p>
        <Link href="/register" className="mt-8 inline-block">
          <BtnTeal>View membership options</BtnTeal>
        </Link>
      </div>
    </div>
  )
}
