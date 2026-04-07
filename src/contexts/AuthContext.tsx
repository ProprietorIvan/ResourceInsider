import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type MembershipTier = 'free' | 'stock_picks' | 'private_placements'
export type UserRole = 'user' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
  membershipTier: MembershipTier
  subscriptionStatus?: string | null
  accreditedInvestor?: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export interface RegisterInput {
  name: string
  email: string
  password: string
  phone?: string
  accreditedInvestor?: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

async function parseJson(res: Response): Promise<{ data: unknown; error?: string }> {
  const text = await res.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { error: text || 'Invalid response' }
  }
  return { data }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (!res.ok) {
        setUser(null)
        return
      }
      const { data } = await parseJson(res)
      const u = data as Record<string, unknown>
      if (u && typeof u.email === 'string') {
        setUser({
          id: String(u.id ?? ''),
          name: String(u.name ?? ''),
          email: u.email,
          role: (u.role as UserRole) || 'user',
          membershipTier: (u.membershipTier as MembershipTier) || 'free',
          subscriptionStatus:
            typeof u.subscriptionStatus === 'string'
              ? u.subscriptionStatus
              : null,
          accreditedInvestor: Boolean(u.accreditedInvestor),
        })
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      await refreshUser()
      if (!cancelled) setIsLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const { data } = await parseJson(res)
    if (!res.ok) {
      const err = (data as { error?: string })?.error || 'Login failed'
      throw new Error(err)
    }
    await refreshUser()
  }, [refreshUser])

  const register = useCallback(
    async (data: RegisterInput) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const { data: body } = await parseJson(res)
      if (!res.ok) {
        const err = (body as { error?: string })?.error || 'Registration failed'
        throw new Error(err)
      }
      await refreshUser()
    },
    [refreshUser],
  )

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
