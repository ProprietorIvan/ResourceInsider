import type { ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import MemberGate from '@/components/MemberGate'
import GlassCard from '@/components/GlassCard'
import { SITE_SHELL_X } from '@/lib/site-shell'
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

const ALERT_BAR: Record<string, string> = {
  buy: 'bg-emerald-400',
  sell: 'bg-red-400',
  hold: 'bg-blue-400',
  trim: 'bg-amber-400',
}

export default function MemberVaultPage() {
  const { user } = useAuth()
  const hasPP = user?.membershipTier === 'private_placements'

  return (
    <main className="px-5 py-10 md:px-8 md:py-14">
      <div className={`mx-auto ${SITE_SHELL_X}`}>
        <div className="reveal">
          <Link
            href="/members"
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-teal)] transition hover:gap-3 hover:underline"
          >
            ← Dashboard
          </Link>
          <h1 className="mt-5 font-display text-3xl font-bold text-white not-italic md:text-4xl">
            Member vault
          </h1>
          <p className="mt-3 max-w-xl text-base text-white/55">
            The archive—research, files, portfolio history, and deal rooms. Built
            to read like a working library, not a landing page.
          </p>
        </div>

        <div className="mt-12 space-y-14">
          <MemberGate requiredTier="stock_picks">
            <section className="space-y-8">
              <VaultSectionTitle icon="SP" variant="teal">
                Stock Picks vault
              </VaultSectionTitle>

              <GlassCard className="rounded-xl p-6 md:p-7" hover>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                  Downloads &amp; files
                </h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <FileLink
                    label="All Stock Picks (Dropbox)"
                    href="https://www.dropbox.com"
                  />
                  <FileLink
                    label="Portfolio tracker spreadsheet"
                    href="#"
                  />
                  <FileLink
                    label="Investment thesis template"
                    href="#"
                  />
                  <FileLink label="Q1 2026 quarterly review" href="#" />
                </div>
              </GlassCard>

              <GlassCard className="rounded-xl p-6 md:p-7" hover>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                  All stock picks
                </h3>
                <div className="mt-5 space-y-4">
                  {STOCK_PICKS.map((pick) => (
                    <div
                      key={pick.slug}
                      className="overflow-hidden rounded-lg border border-white/[0.06] bg-white/[0.04] transition hover:border-[var(--color-teal)]/25"
                    >
                      <div className="px-4 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-white">
                              {pick.title}
                            </h4>
                            <p className="mt-1 text-xs text-white/40">
                              {pick.commodity} · {pick.stage} · {pick.location}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                                pick.status === 'active'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : 'bg-white/10 text-white/40'
                              }`}
                            >
                              {pick.status}
                            </span>
                            <span className="font-mono-nums text-xs text-white/35">
                              {pick.date}
                            </span>
                          </div>
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
                      <details className="vault-details group border-t border-white/[0.06]">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-[var(--color-teal)] transition hover:bg-white/[0.04]">
                          Read thesis
                        </summary>
                        <div className="vault-details-inner space-y-2 px-4 pb-4 text-sm text-white/60">
                          {pick.thesis.map((t, i) => (
                            <p key={i}>{t}</p>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="rounded-xl p-6 md:p-7" hover>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                  Portfolio positions
                </h3>
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
                        <th className="pb-3 pr-4 text-right font-medium">
                          Shares
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
                            {p.status === 'closed' && (
                              <span className="ml-2 text-xs text-white/35">
                                (closed)
                              </span>
                            )}
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
                          <td className="py-3 pr-4 text-right font-mono-nums text-white/50">
                            {p.shares.toLocaleString()}
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
              </GlassCard>

              <GlassCard className="rounded-xl p-6 md:p-7" hover>
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-white/45">
                  Trade alerts history
                </h3>
                <div className="mt-5 space-y-3">
                  {TRADE_ALERTS.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-stretch gap-0 overflow-hidden rounded-lg bg-white/[0.04]"
                    >
                      <div
                        className={`w-1 shrink-0 ${ALERT_BAR[a.type] ?? 'bg-white/30'}`}
                        aria-hidden
                      />
                      <div className="flex flex-1 items-start gap-3 px-4 py-3">
                        <span
                          className={`mt-0.5 shrink-0 rounded px-2 py-0.5 text-[10px] font-bold uppercase ${ALERT_COLORS[a.type]}`}
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
              </GlassCard>

              <div className="relative overflow-hidden rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-950/40 via-[#0f2a3f]/60 to-indigo-950/30 p-6 md:p-7">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-400 to-indigo-600 opacity-80" />
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-200/80">
                  Community
                </h3>
                <p className="mt-3 text-sm text-white/65">
                  Connect with fellow investors and the Resource Insider team in
                  our members-only Discord.
                </p>
                <a
                  href="https://discord.gg/example"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(79,70,229,0.6)] transition hover:bg-indigo-500"
                >
                  Join Stock Picks Discord
                </a>
              </div>
            </section>
          </MemberGate>

          <MemberGate requiredTier="private_placements">
            <section className="space-y-8">
              <VaultSectionTitle icon="PP" variant="amber">
                Private Placements vault
              </VaultSectionTitle>

              <GlassCard
                className="rounded-xl border-amber-500/20 bg-amber-950/15 p-6 md:p-7"
                hover
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-amber-200/75">
                  Deal room files
                </h3>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <FileLink
                    label="All Private Placements (Dropbox)"
                    href="https://www.dropbox.com"
                    amber
                  />
                  <FileLink label="Due diligence reports" href="#" amber />
                  <FileLink
                    label="Private placements guide (PDF)"
                    href="#"
                    amber
                  />
                  <FileLink label="Term sheets archive" href="#" amber />
                </div>
              </GlassCard>

              <GlassCard
                className="rounded-xl border-amber-500/20 bg-amber-950/15 p-6 md:p-7"
                hover
              >
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-amber-200/75">
                  All opportunity reports
                </h3>
                <div className="mt-5 space-y-4">
                  {PRIVATE_PLACEMENTS.map((pp) => (
                    <div
                      key={pp.slug}
                      className="overflow-hidden rounded-lg border border-amber-500/15 bg-white/[0.04] transition hover:border-amber-400/30"
                    >
                      <div className="px-4 py-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-white">
                              {pp.title}
                            </h4>
                            <p className="mt-1 text-xs text-white/40">
                              {pp.commodity} · {pp.stage} · {pp.jurisdiction}
                              {pp.minInvestment && ` · Min ${pp.minInvestment}`}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              pp.status === 'open'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-white/10 text-white/40'
                            }`}
                          >
                            {pp.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-white/60">{pp.teaser}</p>
                        {pp.company && (
                          <p className="mt-2 text-sm font-semibold text-amber-300">
                            {pp.company}
                          </p>
                        )}
                      </div>
                      <details className="vault-details group border-t border-amber-500/15">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-amber-300 transition hover:bg-amber-500/10">
                          Full thesis
                        </summary>
                        <div className="vault-details-inner space-y-2 px-4 pb-4 text-sm text-white/60">
                          {pp.thesis.map((t, i) => (
                            <p key={i}>{t}</p>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-gradient-to-r from-amber-950/50 via-[#1a1408]/80 to-amber-950/40 p-6 md:p-7">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-amber-300 to-amber-600 opacity-90" />
                <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-amber-200/85">
                  Private deals community
                </h3>
                <p className="mt-3 text-sm text-white/65">
                  {hasPP
                    ? 'Exclusive Private Placements Discord—deal flow, diligence threads, and direct access to the team.'
                    : 'Upgrade to Private Placements to access the deal room community.'}
                </p>
                <a
                  href="https://discord.gg/pp-example"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-6px_rgba(217,119,6,0.55)] transition hover:bg-amber-500"
                >
                  Join Private Deals Discord
                </a>
              </div>
            </section>
          </MemberGate>
        </div>
      </div>
    </main>
  )
}

function VaultSectionTitle({
  icon,
  children,
  variant,
}: {
  icon: string
  children: ReactNode
  variant: 'teal' | 'amber'
}) {
  const halo =
    variant === 'amber'
      ? 'bg-amber-400/35 shadow-[0_0_32px_-4px_rgba(251,191,36,0.45)]'
      : 'bg-[var(--color-teal)]/35 shadow-[0_0_32px_-4px_rgba(0,152,166,0.45)]'
  const box =
    variant === 'amber'
      ? 'border-amber-400/30 bg-amber-500/15 text-amber-200'
      : 'border-[var(--color-teal)]/30 bg-[var(--color-teal)]/15 text-[var(--color-teal)]'

  return (
    <h2 className="flex items-center gap-4 font-display text-xl font-bold text-white not-italic md:text-2xl">
      <span className="relative flex h-12 w-12 shrink-0 items-center justify-center md:h-14 md:w-14">
        <span
          className={`pointer-events-none absolute inset-0 -z-10 scale-125 rounded-xl blur-xl ${halo}`}
          aria-hidden
        />
        <span
          className={`flex h-full w-full items-center justify-center rounded-xl border text-sm font-bold tracking-tight md:text-base ${box}`}
        >
          {icon}
        </span>
      </span>
      {children}
    </h2>
  )
}

function FileLink({
  label,
  href,
  amber = false,
}: {
  label: string
  href: string
  amber?: boolean
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`group flex items-center gap-3 rounded-lg border px-4 py-3.5 text-sm font-medium transition-all duration-200 hover:translate-x-1 ${
        amber
          ? 'border-amber-500/25 text-amber-100/90 hover:border-amber-400/40 hover:bg-amber-500/10'
          : 'border-white/10 text-white/85 hover:border-[var(--color-teal)]/35 hover:bg-white/[0.05]'
      }`}
    >
      <svg
        className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${amber ? 'text-amber-400' : 'text-[var(--color-teal)]'}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      {label}
    </a>
  )
}
