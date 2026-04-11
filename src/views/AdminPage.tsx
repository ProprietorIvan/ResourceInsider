import { useEffect, useState } from 'react'
import Link from 'next/link'
import { KeyRound, Mail, X, RefreshCw, Send, Check, ChevronDown, ChevronUp } from 'lucide-react'

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

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%'
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => chars[b % chars.length])
    .join('')
}

interface PasswordPanelProps {
  user: UserRow
  onClose: () => void
}

function PasswordPanel({ user, onClose }: PasswordPanelProps) {
  const [password, setPassword] = useState('')
  const [sendEmail, setSendEmail] = useState(true)
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function handleSave() {
    if (!password || password.length < 6) {
      setErr('Password must be at least 6 characters')
      return
    }
    setSaving(true)
    setErr('')
    try {
      const res = await fetch(`/api/admin/users/${user._id}/set-password`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, sendEmail }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed')
      setDone(true)
      setTimeout(onClose, 1500)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-2 rounded-xl border border-white/10 bg-[var(--color-navy-light)] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white">
          Set password for <span className="text-[var(--color-teal)]">{user.name}</span>
        </p>
        <button onClick={onClose} className="text-white/40 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {err && (
        <p className="mb-3 rounded bg-red-500/10 px-3 py-2 text-xs text-red-300">{err}</p>
      )}

      {done ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <Check className="h-4 w-4" /> Password set{sendEmail ? ' and email sent' : ''}!
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter or generate a password"
              className="flex-1 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 font-mono"
            />
            <button
              type="button"
              onClick={() => setPassword(generatePassword())}
              className="flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-2 text-xs text-white/70 hover:bg-white/5"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Generate
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm text-white/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
              className="h-4 w-4 rounded border-white/30 accent-[var(--color-teal)]"
            />
            Send new password to {user.email}
          </label>

          <button
            onClick={() => void handleSave()}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <KeyRound className="h-4 w-4" />
            )}
            {saving ? 'Saving…' : 'Set Password'}
          </button>
        </div>
      )}
    </div>
  )
}

interface EmailPanelProps {
  user: UserRow
  onClose: () => void
}

function EmailPanel({ user, onClose }: EmailPanelProps) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')

  async function handleSend() {
    if (!subject || !body) { setErr('Subject and message are required'); return }
    setSending(true)
    setErr('')
    try {
      const res = await fetch(`/api/admin/users/${user._id}/send-email`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, body }),
      })
      const data = await res.json() as { error?: string }
      if (!res.ok) throw new Error(data.error || 'Failed')
      setDone(true)
      setTimeout(onClose, 1500)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Error')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mt-2 rounded-xl border border-white/10 bg-[var(--color-navy-light)] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white">
          Email <span className="text-[var(--color-teal)]">{user.name}</span>
        </p>
        <button onClick={onClose} className="text-white/40 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      {err && <p className="mb-3 rounded bg-red-500/10 px-3 py-2 text-xs text-red-300">{err}</p>}

      {done ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <Check className="h-4 w-4" /> Email sent!
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Subject"
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Message…"
            rows={4}
            className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/30 resize-none"
          />
          <button
            onClick={() => void handleSend()}
            disabled={sending}
            className="flex items-center gap-2 rounded-lg bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
          >
            {sending ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sending ? 'Sending…' : 'Send Email'}
          </button>
        </div>
      )}
    </div>
  )
}

export default function AdminPage() {
  const [users, setUsers] = useState<UserRow[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [activePanel, setActivePanel] = useState<'password' | 'email' | null>(null)

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

  function togglePanel(userId: string, panel: 'password' | 'email') {
    if (expandedUser === userId && activePanel === panel) {
      setExpandedUser(null)
      setActivePanel(null)
    } else {
      setExpandedUser(userId)
      setActivePanel(panel)
    }
  }

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
          <p className="rounded border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-200">{error}</p>
          <Link href="/members" className="mt-4 inline-block text-sm text-[var(--color-teal)] hover:underline">
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
            <h1 className="font-display text-3xl font-bold text-white not-italic md:text-4xl">Admin panel</h1>
            <p className="mt-1 text-sm text-white/50">Manage users, passwords, and membership metrics.</p>
          </div>
          <Link href="/members" className="rounded border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/5">
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

        <div className="mt-10 space-y-2">
          {/* Header */}
          <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_auto] gap-4 rounded-xl border border-white/10 bg-[var(--color-navy-light)] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Tier</span>
            <span>Status</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>

          {users.length === 0 && (
            <div className="rounded-xl border border-white/10 px-4 py-8 text-center text-white/40">
              No users found
            </div>
          )}

          {users.map((u) => (
            <div key={u._id} className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/60 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-4 py-3 items-center">
                <span className="font-medium text-white text-sm">{u.name}</span>
                <span className="text-white/60 text-sm truncate">{u.email}</span>
                <span>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-white/50'}`}>
                    {u.role || 'user'}
                  </span>
                </span>
                <span>
                  <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${TIER_COLORS[u.membershipTier] || TIER_COLORS.free}`}>
                    {TIER_LABELS[u.membershipTier] || u.membershipTier}
                  </span>
                </span>
                <span className="text-white/50 text-sm">{u.subscriptionStatus || '—'}</span>
                <span className="text-white/40 text-xs">{new Date(u.createdAt).toLocaleDateString()}</span>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePanel(u._id, 'password')}
                    title="Set password"
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                      expandedUser === u._id && activePanel === 'password'
                        ? 'border-[var(--color-teal)] bg-[var(--color-teal)]/10 text-[var(--color-teal)]'
                        : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Password
                    {expandedUser === u._id && activePanel === 'password' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                  <button
                    onClick={() => togglePanel(u._id, 'email')}
                    title="Send email"
                    className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition ${
                      expandedUser === u._id && activePanel === 'email'
                        ? 'border-[var(--color-teal)] bg-[var(--color-teal)]/10 text-[var(--color-teal)]'
                        : 'border-white/20 text-white/60 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                    {expandedUser === u._id && activePanel === 'email' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>
                </div>
              </div>

              {/* Expanded panel */}
              {expandedUser === u._id && activePanel === 'password' && (
                <div className="border-t border-white/10 px-4 pb-4 pt-2">
                  <PasswordPanel user={u} onClose={() => { setExpandedUser(null); setActivePanel(null) }} />
                </div>
              )}
              {expandedUser === u._id && activePanel === 'email' && (
                <div className="border-t border-white/10 px-4 pb-4 pt-2">
                  <EmailPanel user={u} onClose={() => { setExpandedUser(null); setActivePanel(null) }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function StatCard({ label, value, color = 'text-white' }: { label: string; value: number; color?: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[var(--color-navy-light)]/80 px-4 py-5 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-white/40">{label}</p>
    </div>
  )
}
