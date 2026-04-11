import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { BtnTeal } from '@/components/shared'
import { SITE_SHELL_X } from '@/lib/site-shell'
import GlassCard from '@/components/GlassCard'
import AnimatedStat from '@/components/AnimatedStat'
import {
  STOCK_PICKS,
  PRIVATE_PLACEMENTS,
  TRADE_ALERTS,
  PORTFOLIO,
} from '@/data/opportunities'

const ALERT_BAR: Record<string, string> = {
  buy: 'bg-emerald-400',
  sell: 'bg-red-400',
  hold: 'bg-blue-400',
  trim: 'bg-amber-400',
}

const ALERT_BADGE: Record<string, string> = {
  buy: 'bg-emerald-500/20 text-emerald-300',
  sell: 'bg-red-500/20 text-red-300',
  hold: 'bg-blue-500/20 text-blue-300',
  trim: 'bg-amber-500/20 text-amber-300',
}

export default function MemberHubPage() {
  const { user, logout } = useAuth()
  const [portalError, setPortalError] = useState('')
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [howToOpen, setHowToOpen] = useState(false)

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

  const tierBadgeClass =
    user?.membershipTier === 'private_placements'
      ? 'border-amber-400/40 bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-200 shadow-[0_0_24px_-4px_rgba(251,191,36,0.35)]'
      : user?.membershipTier === 'stock_picks'
        ? 'border-[var(--color-teal)]/40 bg-[var(--color-teal)]/15 text-[var(--color-teal)] shadow-[0_0_20px_-4px_rgba(0,152,166,0.35)]'
        : 'border-white/15 bg-white/5 text-white/70'

  const activePicks = STOCK_PICKS.filter((p) => p.status === 'active')
  const openPlacements = PRIVATE_PLACEMENTS.filter((p) => p.status === 'open')
  const recentAlerts = TRADE_ALERTS.slice(0, 4)
  const activePositions = PORTFOLIO.filter((p) => p.status === 'active')
  const avgGain =
    activePositions.length > 0
      ? activePositions.reduce((s, p) => s + p.gainPct, 0) /
        activePositions.length
      : 0
  const sparkFromPortfolio = activePositions
    .slice(0, 6)
    .map((p) => Math.max(0, p.gainPct + 20))

  return (
    <main className="px-5 py-10 md:px-8 md:py-14">
      <div className={`mx-auto ${SITE_SHELL_X}`}>
        {/* Welcome command strip */}
        <div className="reveal flex flex-wrap items-start justify-between gap-6 border-b border-white/[0.08] pb-10">
          <div className="max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-teal)]/90">
              Member command center
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-white not-italic md:text-4xl lg:text-[2.75rem] lg:leading-tight">
              Welcome back
              {user?.name ? (
                <span className="text-white/95">, {user.name}</span>
              ) : null}
            </h1>
            <p className="mt-3 text-base text-white/55 md:text-lg">
              Your portfolio. Your edge. Everything we&apos;re acting on—laid out
              like a desk, not a brochure.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold ${tierBadgeClass}`}
              >
                {tierLabel}
              </span>
              {user?.subscriptionStatus && (
                <span className="text-sm text-white/40">
                  {user.subscriptionStatus}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-lg border border-white/20 px-4 py-2.5 text-sm text-white/70 transition hover:border-white/35 hover:bg-white/5 hover:text-white"
              onClick={() => void logout()}
            >
              Log out
            </button>
          </div>
        </div>

        {/* Hero metrics */}
        <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <div className="reveal reveal-delay-1">
            <AnimatedStat
              value={activePicks.length}
              label="Active picks"
              glowAccent="teal"
              showPulse={hasPaid}
              sparkline={[3, 5, 4, 7, 6, 8]}
            />
          </div>
          <div className="reveal reveal-delay-2">
            {hasPP ? (
              <AnimatedStat
                value={openPlacements.length}
                label="Open placements"
                glowAccent="amber"
                sparkline={[2, 4, 3, 5, 4, 6]}
              />
            ) : (
              <div className="glass-card glass-card--hover rounded-xl p-5 opacity-80">
                <div className="h-0.5 bg-gradient-to-r from-amber-400/40 to-transparent" />
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Open placements
                </p>
                <p className="mt-3 font-mono-nums text-2xl font-bold text-white/25 md:text-3xl">
                  —
                </p>
                <p className="mt-2 text-xs text-white/35">Private tier</p>
              </div>
            )}
          </div>
          <div className="reveal reveal-delay-3">
            <AnimatedStat
              value={Math.round(avgGain * 10) / 10}
              label="Avg. portfolio return"
              prefix="+"
              suffix="%"
              colorClass="text-emerald-400"
              glowAccent="emerald"
              showPulse={hasPaid && activePositions.length > 0}
              sparkline={
                sparkFromPortfolio.length > 0
                  ? sparkFromPortfolio
                  : [2, 3, 4, 5, 4, 6]
              }
            />
          </div>
          <div className="reveal reveal-delay-4">
            <AnimatedStat
              value={TRADE_ALERTS.length}
              label="Trade alerts (archive)"
              glowAccent="teal"
            />
          </div>
        </div>

        {!hasPaid && (
          <div className="glow-border glow-border--teal relative mt-10 overflow-hidden rounded-xl">
            <div className="relative rounded-[inherit] bg-gradient-to-br from-[var(--color-teal)]/20 via-[#0f2a3f]/90 to-amber-900/20 p-8 md:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-teal)]">
                Full access
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white not-italic md:text-3xl">
                Step through to the other side of the research
              </h2>
              <p className="mt-3 max-w-xl text-sm text-white/65">
                Trade alerts, portfolio snapshots, and full theses are reserved
                for members on a paid tier—same rigor, zero fluff.
              </p>
              <Link href="/register" className="mt-6 inline-block">
                <BtnTeal className="text-sm">View membership options</BtnTeal>
              </Link>
            </div>
          </div>
        )}

        {/* Main grid */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <section className="glass-card rounded-xl p-6 md:p-7">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                  Recent trade alerts
                </h2>
                {hasPaid && (
                  <Link
                    href="/members/vault"
                    className="text-xs font-medium text-[var(--color-teal)] hover:underline"
                  >
                    View all
                  </Link>
                )}
              </div>
              {hasPaid ? (
                <div className="mt-5 space-y-3">
                  {recentAlerts.map((a) => (
                    <div
                      key={a.id}
                      className="group flex items-stretch gap-0 overflow-hidden rounded-lg bg-white/[0.04] transition hover:bg-white/[0.06]"
                    >
                      <div
                        className={`w-1 shrink-0 ${ALERT_BAR[a.type] ?? 'bg-white/30'}`}
                        aria-hidden
                      />
                      <div className="flex flex-1 items-start gap-3 px-4 py-3">
                        <span
                          className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${ALERT_BADGE[a.type] ?? 'bg-white/10 text-white/50'}`}
                        >
                          {a.type}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white">{a.title}</p>
                          <p className="mt-0.5 text-xs text-white/50">
                            {a.detail}
                          </p>
                        </div>
                        <span className="shrink-0 font-mono-nums text-xs text-white/35">
                          {a.date}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <LockedBlock />
              )}
            </section>

            <section className="glass-card rounded-xl p-6 md:p-7">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                Portfolio snapshot
              </h2>
              {hasPaid ? (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] uppercase tracking-wider text-white/40">
                        <th className="pb-3 pr-4 font-medium">Company</th>
                        <th className="pb-3 pr-4 font-medium">Ticker</th>
                        <th className="pb-3 pr-4 text-right font-medium">
                          Entry
                        </th>
                        <th className="pb-3 pr-4 text-right font-medium">
                          Current
                        </th>
                        <th className="pb-3 text-right font-medium">Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PORTFOLIO.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-white/[0.06] transition hover:bg-white/[0.04]"
                        >
                          <td className="py-3 pr-4 font-medium text-white">
                            {p.name}
                          </td>
                          <td className="py-3 pr-4 font-mono-nums text-white/55">
                            {p.ticker}
                          </td>
                          <td className="py-3 pr-4 text-right font-mono-nums text-white/50">
                            ${p.entryPrice.toFixed(2)}
                          </td>
                          <td className="py-3 pr-4 text-right font-mono-nums text-white/75">
                            ${p.currentPrice.toFixed(2)}
                          </td>
                          <td
                            className={`py-3 text-right font-mono-nums font-semibold ${
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

            <section className="glass-card rounded-xl p-6 md:p-7">
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                Latest stock picks
              </h2>
              {hasPaid ? (
                <div className="mt-5 space-y-4">
                  {activePicks.slice(0, 3).map((pick) => (
                    <div
                      key={pick.slug}
                      className="shimmer-border rounded-lg bg-white/[0.04] px-4 py-4 transition hover:bg-white/[0.06]"
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
                        <span className="font-mono-nums text-xs text-white/35">
                          {pick.date}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-white/60">{pick.excerpt}</p>
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

          <div className="space-y-6">
            <GlassCard
              className="rounded-xl p-6"
              glow
              glowVariant={
                user?.membershipTier === 'private_placements'
                  ? 'gold'
                  : 'teal'
              }
            >
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                Your membership
              </h2>
              <p
                className={`mt-3 font-display text-xl font-bold not-italic ${
                  user?.membershipTier === 'private_placements'
                    ? 'text-amber-200'
                    : user?.membershipTier === 'stock_picks'
                      ? 'text-[var(--color-teal)]'
                      : 'text-white/70'
                }`}
              >
                {tierLabel}
              </p>
              {hasPaid && (
                <div className="mt-5">
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
                <Link href="/register" className="mt-5 inline-block w-full">
                  <BtnTeal className="w-full justify-center text-xs">
                    Upgrade membership
                  </BtnTeal>
                </Link>
              )}
            </GlassCard>

            <GlassCard className="rounded-xl p-6" hover>
              <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                Quick links
              </h2>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link
                    href="/members/vault"
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-white/85 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-teal)]/25 text-xs font-bold text-[var(--color-teal)] shadow-[0_0_16px_-4px_rgba(0,152,166,0.5)]">
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
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-white/85 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/25 text-xs font-bold text-indigo-200 shadow-[0_0_16px_-4px_rgba(99,102,241,0.4)]">
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
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-white/85 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/25 text-xs font-bold text-sky-200 shadow-[0_0_16px_-4px_rgba(14,165,233,0.35)]">
                      ↓
                    </span>
                    Dropbox files
                  </a>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-white/85 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white/70">
                      B
                    </span>
                    Blog / research
                  </Link>
                </li>
              </ul>
            </GlassCard>

            {hasPP && (
              <GlassCard className="rounded-xl border-amber-500/25 bg-amber-950/20 p-6" hover>
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300/80">
                  Open placements
                </h2>
                <div className="mt-4 space-y-4">
                  {openPlacements.slice(0, 3).map((pp) => (
                    <div
                      key={pp.slug}
                      className="border-l-2 border-amber-400/50 pl-3"
                    >
                      <p className="font-semibold text-white">{pp.title}</p>
                      <p className="mt-1 text-xs text-white/45">
                        {pp.commodity} · {pp.jurisdiction}
                        {pp.minInvestment && ` · Min ${pp.minInvestment}`}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            <GlassCard className="rounded-xl p-6" hover>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 text-left"
                onClick={() => setHowToOpen((o) => !o)}
                aria-expanded={howToOpen}
              >
                <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                  How to use the site
                </h2>
                {howToOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-white/50" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-white/50" />
                )}
              </button>
              {howToOpen && (
                <ol className="mt-4 list-inside list-decimal space-y-2.5 text-sm text-white/60">
                  <li>
                    Check{' '}
                    <strong className="text-white/85">Trade Alerts</strong> for
                    buy / sell / hold.
                  </li>
                  <li>
                    Review the{' '}
                    <strong className="text-white/85">Portfolio</strong> for
                    positions and returns.
                  </li>
                  <li>
                    Read{' '}
                    <strong className="text-white/85">Stock Picks</strong> for
                    full theses.
                  </li>
                  <li>
                    Visit the{' '}
                    <strong className="text-white/85">Vault</strong> for files
                    and archives.
                  </li>
                  <li>
                    Join{' '}
                    <strong className="text-white/85">Discord</strong> for live
                    discussion.
                  </li>
                </ol>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </main>
  )
}

function LockedBlock() {
  return (
    <div className="mt-5 rounded-lg border border-[var(--color-teal)]/35 bg-[var(--color-teal)]/10 px-5 py-8 text-center backdrop-blur-sm">
      <p className="text-sm font-semibold text-white/90">
        Upgrade to unlock this content
      </p>
      <p className="mt-2 text-xs text-white/50">
        Same research standards—member-only distribution.
      </p>
      <Link href="/register" className="mt-5 inline-block">
        <BtnTeal className="text-xs">View plans</BtnTeal>
      </Link>
    </div>
  )
}
