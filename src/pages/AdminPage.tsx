import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface UserRow {
  _id: string
  name: string
  email: string
  role: string
  membershipTier: string
  subscriptionStatus?: string
  accreditedInvestor?: boolean
  phone?: string
  createdAt: string
}

interface Stats {
  total: number
  free: number
  stockPicks: number
  privatePlacements: number
  accredited: number
}

const TIER_COLORS: Record<string, string> = {
  free: 'bg-gray-500/20 text-gray-300',
  stock_picks: 'bg-[var(--color-teal)]/20 text-[var(--color-teal)]',
  private_placements: 'bg-amber-500/20 text-amber-300',
}

const TIER_LABELS: Record<string, string> = {
  free: 'Free',
  stock_picks: 'Stock Picks',
  private_placements: 'Private Placements',
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const [uRes, sRes] = await Promise.all([
          fetch('/api/admin/users', { credentials: 'include' }),
          fetch('/api/admin/stats', { credentials: 'include' }),
        ])
        if (!uRes.ok) {
          const d = (await uRes.json()) as { error?: string }
          throw new Error(d.error || 'Unauthorized')
        }
        const uData = (await uRes.json()) as { users: UserRow[] }
        const sData = (await sRes.json()) as Stats
        setUsers(uData.users)
        setStats(sData)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  if (loading) {
    return (
      <main className="bg-[var(--color-navy)] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl text-white/60">Loading admin data…</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="bg-[var(--color-navy)] px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <p className="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">
            {error}
          </p>
          <Link to="/members" className="mt-4 inline-block text-sm text-[var(--color-teal)] hover:underline">
            Back to dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-[var(--color-navy)] px-5 py-10 md:px-8 md:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold text-white not-italic md:text-4xl">
              Admin panel
            </h1>
            <p className="mt-1 text-sm text-white/50">
              Manage users and view membership metrics.
            </p>
          </div>
          <Link
            to="/members"
            className="rounded border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5"
          >
            ← Dashboard
          </Link>
        </div>

        {stats && (
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
            <StatCard label="Total users" value={stats.total} />
            <StatCard label="Free" value={stats.free} color="text-gray-300" />
            <StatCard label="Stock Picks" value={stats.stockPicks} color="text-[var(--color-teal)]" />
            <StatCard label="Private Placements" value={stats.privatePlacements} color="text-amber-300" />
            <StatCard label="Accredited" value={stats.accredited} color="text-emerald-300" />
          </div>
        )}

        <div className="mt-10 overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-[var(--color-navy-light)]">
                <th className="px-4 py-3 font-semibold text-white/70">Name</th>
                <th className="px-4 py-3 font-semibold text-white/70">Email</th>
                <th className="px-4 py-3 font-semibold text-white/70">Role</th>
                <th className="px-4 py-3 font-semibold text-white/70">Tier</th>
                <th className="px-4 py-3 font-semibold text-white/70">Status</th>
                <th className="px-4 py-3 font-semibold text-white/70">Accredited</th>
                <th className="px-4 py-3 font-semibold text-white/70">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-white/5 transition hover:bg-white/[0.03]"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                    {u.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-white/60">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        u.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {u.role || 'user'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        TIER_COLORS[u.membershipTier] || TIER_COLORS.free
                      }`}
                    >
                      {TIER_LABELS[u.membershipTier] || u.membershipTier}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-white/60">
                    {u.subscriptionStatus || '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {u.accreditedInvestor ? (
                      <span className="text-emerald-400">Yes</span>
                    ) : (
                      <span className="text-white/30">No</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-white/40">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-white/40">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}

function StatCard({
  label,
  value,
  color = 'text-white',
}: {
  label: string
  value: number
  color?: string
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 px-4 py-5 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-white/40">{label}</p>
    </div>
  )
}
