import { useState, useEffect, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { SITE_PAD_X, SITE_SHELL_X } from '@/lib/site-shell'
import { BtnTeal, RILogo, XIcon, LinkedInIcon, YouTubeIcon, SpotifyIcon, ApplePodcastsIcon } from './shared'

const SOCIAL_LINKS = [
  { name: 'Twitter', href: 'https://twitter.com/Jamie_Keech', Icon: XIcon },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/resource-insider-podcast/', Icon: LinkedInIcon },
  { name: 'Spotify', href: 'https://open.spotify.com/show/3ntPCBkRwozitGOXcscwu6', Icon: SpotifyIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@resourceinsider', Icon: YouTubeIcon },
  { name: 'Apple Podcasts', href: 'https://podcasts.apple.com/ca/podcast/resource-insider-podcast/id1395299172', Icon: ApplePodcastsIcon },
]

const SCROLL_SOLID_AT = 24

export default function Layout({
  children,
  membersAtmosphere = false,
}: {
  children: ReactNode
  membersAtmosphere?: boolean
}) {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()
  const onMembers = router.pathname.startsWith('/members')
  const onAdmin = router.pathname.startsWith('/admin')

  const fullBleedHero =
    router.pathname === '/' ||
    router.pathname === '/join' ||
    router.pathname === '/blog'

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_SOLID_AT)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [router.pathname])

  const solidBar = scrolled || menuOpen

  let headerClass =
    'fixed top-0 left-0 right-0 z-50 transition-[background-color,backdrop-filter,border-color,box-shadow] duration-300 ease-out'
  if (membersAtmosphere) {
    headerClass += solidBar
      ? ' border-b border-white/[0.08] bg-[#060d16]/92 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl'
      : ' border-b border-transparent bg-transparent'
  } else {
    headerClass += solidBar
      ? ' border-b border-white/[0.08] bg-[#0a1520]/95 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl'
      : ' border-b border-transparent bg-transparent'
  }

  const navLinkMembers = (active: boolean) =>
    active
      ? 'text-sm font-medium text-[var(--color-teal)] drop-shadow-[0_0_12px_rgba(0,152,166,0.35)]'
      : 'text-sm text-white/90 transition hover:text-white'

  const mobileNavPanelClass = solidBar
    ? 'border-white/[0.08] bg-[#0a1520]/98 backdrop-blur-xl'
    : 'border-white/[0.08] bg-[#0a1520]/95 backdrop-blur-xl'

  return (
    <>
      <header className={headerClass}>
        <div className={`mx-auto flex items-center justify-between py-4 ${SITE_SHELL_X}`}>
          <Link href="/">
            <RILogo />
          </Link>
          <nav className="hidden items-center gap-5 md:flex" aria-label="Main">
            {isAuthenticated ? (
              <>
                <span className="max-w-[160px] truncate text-sm text-white/80" title={user?.email}>
                  {user?.name || user?.email}
                </span>
                <Link href="/members" className={navLinkMembers(onMembers && !onAdmin)}>
                  Dashboard
                </Link>
                {user?.role === 'admin' && (
                  <Link href="/admin" className={navLinkMembers(onAdmin)}>
                    Admin
                  </Link>
                )}
                <button
                  type="button"
                  className="text-sm text-white/90 transition hover:text-white"
                  onClick={() => void logout()}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="text-sm text-white/80 transition hover:text-white">
                  Register
                </Link>
                <Link
                  href="/login"
                  className="rounded-lg border border-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-[var(--color-teal)] transition hover:bg-[var(--color-teal)] hover:text-white"
                >
                  Login
                </Link>
              </>
            )}
            <Link href="/join">
              <BtnTeal>Join The List</BtnTeal>
            </Link>
          </nav>
          <button
            type="button"
            className="text-white md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {menuOpen && (
          <div className={`border-t md:hidden ${mobileNavPanelClass}`}>
            <nav className={`flex flex-col gap-4 py-4 ${SITE_PAD_X}`} aria-label="Mobile">
              {isAuthenticated ? (
                <>
                  <span className="text-base text-white/80">{user?.name || user?.email}</span>
                  <Link
                    href="/members"
                    className={onMembers && !onAdmin ? 'text-base font-medium text-[var(--color-teal)]' : 'text-base text-white'}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      href="/admin"
                      className={onAdmin ? 'text-base font-medium text-[var(--color-teal)]' : 'text-base text-white'}
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    className="text-left text-base text-white"
                    onClick={() => {
                      setMenuOpen(false)
                      void logout()
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/register" className="text-base text-white/80" onClick={() => setMenuOpen(false)}>
                    Register
                  </Link>
                  <Link
                    href="/login"
                    className="rounded-lg border border-[var(--color-teal)] px-4 py-2 text-base font-semibold text-[var(--color-teal)] text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
              <Link href="/join" onClick={() => setMenuOpen(false)}>
                <BtnTeal className="w-full">Join The List</BtnTeal>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {fullBleedHero ? (
        children
      ) : (
        <div className="pt-[4.75rem]">{children}</div>
      )}

      <footer
        className={
          membersAtmosphere
            ? 'border-t border-white/[0.06] bg-[#0a1520] py-14'
            : 'border-t border-white/[0.06] bg-[#0a1520] py-14'
        }
      >
        <div className={`mx-auto grid gap-10 md:grid-cols-2 lg:grid-cols-5 ${SITE_SHELL_X}`}>
          <div className="lg:col-span-1">
            <Link href="/">
              <RILogo />
            </Link>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/join" className="hover:text-white">
                  Invest
                </Link>
              </li>
              <li>
                <a href="/#faq-section" className="hover:text-white">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Resources</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              {isAuthenticated ? (
                <li>
                  <Link href="/members" className="hover:text-white">
                    Members
                  </Link>
                </li>
              ) : (
                <li>
                  <Link href="/register" className="hover:text-white">
                    Membership
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Stay Connected</p>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <li key={name}>
                  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-white">
                    <Icon className="h-4 w-4" />
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-white">Subscribe</p>
            <p className="mt-4 text-sm text-white/60">Join our newsletter for the latest updates and insights.</p>
            <form className="mt-4 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your Email"
                className="min-h-[42px] flex-1 rounded border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-white/40"
              />
              <button type="submit" className="min-h-[42px] rounded bg-[var(--color-teal)] px-4 text-sm font-semibold text-white">
                Join
              </button>
            </form>
            <p className="mt-2 text-xs text-white/40">
              By subscribing, you agree to our{' '}
              <a href="https://resourceinsider.com/privacy-policy-2/" className="text-[var(--color-teal)]" target="_blank" rel="noreferrer">
                Privacy Policy
              </a>{' '}
              and consent to receive updates.
            </p>
          </div>
        </div>

        <div className={`mx-auto mt-12 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between ${SITE_SHELL_X}`}>
          <p className="text-center text-xs text-white/40 md:text-left">
            &copy; {new Date().getFullYear()} Resource Insider. All rights reserved.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 md:mt-0">
            <Link href="/privacy-policy" className="text-xs text-white/40 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white">
              Terms of Use
            </Link>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ name, href, Icon }) => (
                <a key={name} href={href} target="_blank" rel="noreferrer" className="text-white/40 hover:text-white" aria-label={name}>
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
