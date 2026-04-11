import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { BtnTeal } from '@/components/shared'
import {
  STOCK_PICKS,
  PRIVATE_PLACEMENTS,
  TRADE_ALERTS,
  PORTFOLIO,
} from '@/data/opportunities'

const ALERT_COLORS: Record<string, string> = {
  buy: 'bg-emerald-500/20 text-emerald-300',
  sell: 'bg-red-500/20 text-red-300',
  hold: 'bg-blue-500/20 text-blue-300',
  trim: 'bg-amber-500/20 text-amber-300',
}

export default function MemberHubPage() {
  const { user, logout } = useAuth()
  const [portalError, setPortalError] = useState('')
  const [loadingPortal, setLoadingPortal] = useState(false)
  const hasPaid =
    user?.membershipTier === 'stock_picks' ||
    user?.membershipTier === 'private_placements'
  const hasPP = user?.membershipTier === 'private_placements'

  async function openBillingPortal() {
    setPortalError('')
    setLoadingPortal(true)
    try {
      const res = await fetch('/api/stripe/portal', {
        method: 'POST',
        credentials: 'include',
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        setPortalError(data.error || 'Could not open billing portal')
        return
      }
      window.location.href = data.url
    } catch {
      setPortalError('Network error')
    } finally {
      setLoadingPortal(false)
    }
  }

  const tierLabel =
    user?.membershipTier === 'private_placements'
      ? 'Private Placements'
      : user?.membershipTier === 'stock_picks'
        ? 'Stock Picks'
        : 'Free / Newsletter'

  const tierColor =
    user?.membershipTier === 'private_placements'
      ? 'text-amber-300'
      : user?.membershipTier === 'stock_picks'
        ? 'text-[var(--color-teal)]'
        : 'text-white/60'

  const activePicks = STOCK_PICKS.filter((p) => p.status === 'active')
  const openPlacements = PRIVATE_PLACEMENTS.filter((p) => p.status === 'open')
  const recentAlerts = TRADE_ALERTS.slice(0, 4)
  const activePositions = PORTFOLIO.filter((p) => p.status === 'active')

  return (
    <main className="bg-[var(--color-navy)] px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-white not-italic md:text-4xl">
              Welcome back{user?.name ? `, ${user.name}` : ''}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
              <span className={`rounded-full border border-white/10 px-3 py-1 font-semibold ${tierColor}`}>
                {tierLabel}
              </span>
              {user?.subscriptionStatus && (
                <span className="text-white/40">
                  Subscription: {user.subscriptionStatus}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="rounded border border-purple-400/40 px-4 py-2 text-sm font-semibold text-purple-300 hover:bg-purple-500/10"
              >
                Admin panel
              </Link>
            )}
            <button
              type="button"
              className="rounded border border-white/20 px-4 py-2 text-sm text-white/60 hover:bg-white/5"
              onClick={() => void logout()}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Quick-stats strip */}
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          <QuickStat label="Active picks" value={activePicks.length} />
          <QuickStat
            label="Open placements"
            value={openPlacements.length}
            locked={!hasPP}
          />
          <QuickStat
            label="Portfolio gain"
            value={`+${(
              activePositions.reduce((s, p) => s + p.gainPct, 0) /
              (activePositions.length || 1)
            ).toFixed(1)}%`}
            color="text-emerald-400"
          />
          <QuickStat label="Trade alerts" value={TRADE_ALERTS.length} />
        </div>

        {/* Main grid */}
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left column (2/3) */}
          <div className="space-y-8 lg:col-span-2">
            {/* Recent trade alerts */}
            <section className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
                  Recent trade alerts
                </h2>
                {hasPaid && (
                  <Link href="/members/vault" className="text-xs text-[var(--color-teal)] hover:underline">
                    View all
                  </Link>
                )}
              </div>
              {hasPaid ? (
                <div className="mt-4 space-y-3">
                  {recentAlerts.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-3 rounded-lg bg-white/[0.03] px-4 py-3"
                    >
                      <span
                        className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${ALERT_COLORS[a.type]}`}
                      >
                        {a.type}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">{a.title}</p>
                        <p className="mt-0.5 text-xs text-white/50">{a.detail}</p>
                      </div>
                      <span className="shrink-0 text-xs text-white/30">
                        {a.date}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <LockedBlock />
              )}
            </section>

            {/* Portfolio snapshot */}
            <section className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
                Portfolio snapshot
              </h2>
              {hasPaid ? (
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase text-white/40">
                        <th className="pb-2 pr-4">Company</th>
                        <th className="pb-2 pr-4">Ticker</th>
                        <th className="pb-2 pr-4 text-right">Entry</th>
                        <th className="pb-2 pr-4 text-right">Current</th>
                        <th className="pb-2 text-right">Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PORTFOLIO.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-white/5"
                        >
                          <td className="py-2 pr-4 font-medium text-white">
                            {p.name}
                          </td>
                          <td className="py-2 pr-4 text-white/50">{p.ticker}</td>
                          <td className="py-2 pr-4 text-right text-white/50">
                            ${p.entryPrice.toFixed(2)}
                          </td>
                          <td className="py-2 pr-4 text-right text-white/70">
                            ${p.currentPrice.toFixed(2)}
                          </td>
                          <td
                            className={`py-2 text-right font-semibold ${
                              p.gainPct >= 0
                                ? 'text-emerald-400'
                                : 'text-red-400'
                            }`}
                          >
                            {p.gainPct >= 0 ? '+' : ''}
                            {p.gainPct.toFixed(1)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <LockedBlock />
              )}
            </section>

            {/* Latest stock picks */}
            <section className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
                Latest stock picks
              </h2>
              {hasPaid ? (
                <div className="mt-4 space-y-4">
                  {activePicks.slice(0, 3).map((pick) => (
                    <div
                      key={pick.slug}
                      className="rounded-lg bg-white/[0.03] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-white">
                            {pick.title}
                          </h3>
                          <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/40">
                            <span>{pick.commodity}</span>
                            <span>·</span>
                            <span>{pick.stage}</span>
                            <span>·</span>
                            <span>{pick.location}</span>
                          </div>
                        </div>
                        <span className="text-xs text-white/30">{pick.date}</span>
                      </div>
                      <p className="mt-2 text-sm text-white/60">
                        {pick.excerpt}
                      </p>
                      {pick.company && (
                        <p className="mt-2 text-sm font-semibold text-[var(--color-teal)]">
                          {pick.company} ({pick.ticker})
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <LockedBlock />
              )}
            </section>
          </div>

          {/* Right column (1/3) */}
          <div className="space-y-6">
            {/* Membership card */}
            <div className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
                Your membership
              </h2>
              <p className={`mt-2 text-lg font-bold ${tierColor}`}>{tierLabel}</p>
              {hasPaid && (
                <div className="mt-4">
                  {portalError && (
                    <p className="mb-2 text-xs text-red-300">{portalError}</p>
                  )}
                  <BtnTeal
                    type="button"
                    className="w-full justify-center text-xs"
                    disabled={loadingPortal}
                    onClick={() => void openBillingPortal()}
                  >
                    {loadingPortal ? 'Opening…' : 'Manage subscription'}
                  </BtnTeal>
                </div>
              )}
              {!hasPaid && (
                <Link href="/register" className="mt-4 inline-block">
                  <BtnTeal className="w-full justify-center text-xs">
                    Upgrade membership
                  </BtnTeal>
                </Link>
              )}
            </div>

            {/* Quick links */}
            <div className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
                Quick links
              </h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="/members/vault"
                    className="flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-[var(--color-teal)]/20 text-xs text-[var(--color-teal)]">
                      V
                    </span>
                    Member vault
                  </Link>
                </li>
                <li>
                  <a
                    href="https://discord.gg/example"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-indigo-500/20 text-xs text-indigo-300">
                      D
                    </span>
                    Community (Discord)
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.dropbox.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-blue-500/20 text-xs text-blue-300">
                      D
                    </span>
                    Dropbox files
                  </a>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="flex items-center gap-2 text-white/80 hover:text-white"
                  >
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-white/10 text-xs text-white/60">
                      B
                    </span>
                    Blog / research
                  </Link>
                </li>
              </ul>
            </div>

            {/* Private placements preview */}
            {hasPP && (
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300/70">
                  Open placements
                </h2>
                <div className="mt-4 space-y-3">
                  {openPlacements.slice(0, 3).map((pp) => (
                    <div key={pp.slug}>
                      <p className="font-semibold text-white">{pp.title}</p>
                      <p className="mt-0.5 text-xs text-white/40">
                        {pp.commodity} · {pp.jurisdiction}
                        {pp.minInvestment && ` · Min ${pp.minInvestment}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How to use the site */}
            <div className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white/50">
                How to use the site
              </h2>
              <ol className="mt-4 list-inside list-decimal space-y-2 text-sm text-white/60">
                <li>
                  Check <strong className="text-white/80">Trade Alerts</strong> for the latest buy/sell/hold actions.
                </li>
                <li>
                  Review the <strong className="text-white/80">Portfolio</strong> for current positions and returns.
                </li>
                <li>
                  Read <strong className="text-white/80">Stock Picks</strong> for full thesis write-ups.
                </li>
                <li>
                  Visit the <strong className="text-white/80">Vault</strong> for downloadable research and Dropbox files.
                </li>
                <li>
                  Join <strong className="text-white/80">Discord</strong> for live discussion with the team and other members.
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

function QuickStat({
  label,
  value,
  color = 'text-white',
  locked = false,
}: {
  label: string
  value: number | string
  color?: string
  locked?: boolean
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 px-4 py-4 text-center">
      <p className={`text-xl font-bold ${locked ? 'text-white/20' : color}`}>
        {locked ? '—' : value}
      </p>
      <p className="mt-1 text-[11px] uppercase tracking-wider text-white/40">
        {label}
      </p>
    </div>
  )
}

function LockedBlock() {
  return (
    <div className="mt-4 rounded-lg border border-[var(--color-teal)]/30 bg-[var(--color-teal-light)] px-4 py-6 text-center">
      <p className="text-sm font-semibold text-white/80">
        Upgrade to unlock this content
      </p>
      <Link href="/register" className="mt-3 inline-block">
        <BtnTeal className="text-xs">View plans</BtnTeal>
      </Link>
    </div>
  )
}
