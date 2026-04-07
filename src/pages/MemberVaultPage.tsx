import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import MemberGate from '../components/MemberGate'
import { STOCK_PICKS, PRIVATE_PLACEMENTS, TRADE_ALERTS, PORTFOLIO } from '../data/opportunities'

const ALERT_COLORS: Record<string, string> = {
  buy: 'bg-emerald-500/20 text-emerald-300',
  sell: 'bg-red-500/20 text-red-300',
  hold: 'bg-blue-500/20 text-blue-300',
  trim: 'bg-amber-500/20 text-amber-300',
}

export default function MemberVaultPage() {
  const { user } = useAuth()
  const hasPP = user?.membershipTier === 'private_placements'

  return (
    <main className="bg-[var(--color-navy)] px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/members"
          className="text-sm text-[var(--color-teal)] hover:underline"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold text-white not-italic md:text-4xl">
          Member vault
        </h1>
        <p className="mt-2 text-white/60">
          Research, downloads, portfolio updates, and deal rooms.
        </p>

        <div className="mt-10 space-y-10">
          {/* Stock picks vault */}
          <MemberGate requiredTier="stock_picks">
            <section>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white not-italic">
                <span className="flex h-8 w-8 items-center justify-center rounded bg-[var(--color-teal)]/20 text-sm text-[var(--color-teal)]">
                  SP
                </span>
                Stock Picks vault
              </h2>

              {/* Downloads */}
              <div className="mt-6 rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
                  Downloads &amp; files
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <FileLink label="All Stock Picks (Dropbox)" href="https://www.dropbox.com" />
                  <FileLink label="Portfolio tracker spreadsheet" href="#" />
                  <FileLink label="Investment thesis template" href="#" />
                  <FileLink label="Q1 2026 quarterly review" href="#" />
                </div>
              </div>

              {/* Full stock picks list */}
              <div className="mt-6 rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
                  All stock picks
                </h3>
                <div className="mt-4 space-y-4">
                  {STOCK_PICKS.map((pick) => (
                    <div
                      key={pick.slug}
                      className="rounded-lg bg-white/[0.03] px-4 py-4"
                    >
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
                          <span className="text-xs text-white/30">
                            {pick.date}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-white/60">{pick.excerpt}</p>
                      {pick.company && (
                        <p className="mt-2 text-sm font-semibold text-[var(--color-teal)]">
                          {pick.company} ({pick.ticker})
                        </p>
                      )}
                      <details className="mt-3 text-sm">
                        <summary className="cursor-pointer text-[var(--color-teal)] hover:underline">
                          Read thesis
                        </summary>
                        <div className="mt-2 space-y-2 text-white/60">
                          {pick.thesis.map((t, i) => (
                            <p key={i}>{t}</p>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>

              {/* Portfolio */}
              <div className="mt-6 rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
                  Portfolio positions
                </h3>
                <div className="mt-4 overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-xs uppercase text-white/40">
                        <th className="pb-2 pr-4">Company</th>
                        <th className="pb-2 pr-4">Ticker</th>
                        <th className="pb-2 pr-4 text-right">Entry</th>
                        <th className="pb-2 pr-4 text-right">Current</th>
                        <th className="pb-2 pr-4 text-right">Shares</th>
                        <th className="pb-2 text-right">Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PORTFOLIO.map((p) => (
                        <tr key={p.id} className="border-b border-white/5">
                          <td className="py-2 pr-4 font-medium text-white">
                            {p.name}
                            {p.status === 'closed' && (
                              <span className="ml-2 text-xs text-white/30">
                                (closed)
                              </span>
                            )}
                          </td>
                          <td className="py-2 pr-4 text-white/50">{p.ticker}</td>
                          <td className="py-2 pr-4 text-right text-white/50">
                            ${p.entryPrice.toFixed(2)}
                          </td>
                          <td className="py-2 pr-4 text-right text-white/70">
                            ${p.currentPrice.toFixed(2)}
                          </td>
                          <td className="py-2 pr-4 text-right text-white/50">
                            {p.shares.toLocaleString()}
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
              </div>

              {/* All trade alerts */}
              <div className="mt-6 rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
                  Trade alerts history
                </h3>
                <div className="mt-4 space-y-3">
                  {TRADE_ALERTS.map((a) => (
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
                        <p className="mt-0.5 text-xs text-white/50">
                          {a.detail}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-white/30">
                        {a.date}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Community */}
              <div className="mt-6 rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
                  Community
                </h3>
                <p className="mt-3 text-sm text-white/60">
                  Connect with fellow investors and the Resource Insider team in
                  our members-only Discord.
                </p>
                <a
                  href="https://discord.gg/example"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
                >
                  Join Stock Picks Discord
                </a>
              </div>
            </section>
          </MemberGate>

          {/* Private placements vault */}
          <MemberGate requiredTier="private_placements">
            <section>
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white not-italic">
                <span className="flex h-8 w-8 items-center justify-center rounded bg-amber-500/20 text-sm text-amber-300">
                  PP
                </span>
                Private Placements vault
              </h2>

              {/* Downloads */}
              <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300/70">
                  Deal room files
                </h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <FileLink
                    label="All Private Placements (Dropbox)"
                    href="https://www.dropbox.com"
                    amber
                  />
                  <FileLink
                    label="Due diligence reports"
                    href="#"
                    amber
                  />
                  <FileLink
                    label="Private placements guide (PDF)"
                    href="#"
                    amber
                  />
                  <FileLink
                    label="Term sheets archive"
                    href="#"
                    amber
                  />
                </div>
              </div>

              {/* Full placements list */}
              <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300/70">
                  All opportunity reports
                </h3>
                <div className="mt-4 space-y-4">
                  {PRIVATE_PLACEMENTS.map((pp) => (
                    <div
                      key={pp.slug}
                      className="rounded-lg bg-white/[0.03] px-4 py-4"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="font-semibold text-white">
                            {pp.title}
                          </h4>
                          <p className="mt-1 text-xs text-white/40">
                            {pp.commodity} · {pp.stage} · {pp.jurisdiction}
                            {pp.minInvestment &&
                              ` · Min ${pp.minInvestment}`}
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
                      <details className="mt-3 text-sm">
                        <summary className="cursor-pointer text-amber-300 hover:underline">
                          Full thesis
                        </summary>
                        <div className="mt-2 space-y-2 text-white/60">
                          {pp.thesis.map((t, i) => (
                            <p key={i}>{t}</p>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>

              {/* PP community */}
              <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-300/70">
                  Private deals community
                </h3>
                <p className="mt-3 text-sm text-white/60">
                  {hasPP
                    ? 'Access the exclusive Private Placements Discord for deal flow discussion and direct access to the team.'
                    : 'Upgrade to Private Placements to access the deal room community.'}
                </p>
                <a
                  href="https://discord.gg/pp-example"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-500"
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
      className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition hover:bg-white/5 ${
        amber
          ? 'border-amber-500/20 text-amber-200'
          : 'border-white/10 text-white/80'
      }`}
    >
      <svg
        className={`h-5 w-5 shrink-0 ${amber ? 'text-amber-400' : 'text-[var(--color-teal)]'}`}
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
