import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { BtnTeal, RILogo, XIcon, LinkedInIcon, YouTubeIcon, SpotifyIcon, ApplePodcastsIcon } from './shared'

const SOCIAL_LINKS = [
  { name: 'Twitter', href: 'https://twitter.com/Jamie_Keech', Icon: XIcon },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/resource-insider-podcast/', Icon: LinkedInIcon },
  { name: 'Spotify', href: 'https://open.spotify.com/show/3ntPCBkRwozitGOXcscwu6', Icon: SpotifyIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@resourceinsider', Icon: YouTubeIcon },
  { name: 'Apple Podcasts', href: 'https://podcasts.apple.com/ca/podcast/resource-insider-podcast/id1395299172', Icon: ApplePodcastsIcon },
]

export default function Layout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <>
      <header className="sticky top-0 z-50 bg-[var(--color-navy)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          <Link href="/">
            <RILogo />
          </Link>
          <nav className="hidden items-center gap-5 md:flex" aria-label="Main">
            {isAuthenticated ? (
              <>
                <span className="max-w-[140px] truncate text-sm text-white/70" title={user?.email}>
                  {user?.name || user?.email}
                </span>
                <Link href="/members" className="text-sm text-white/80 transition hover:text-white">
                  Dashboard
                </Link>
                <button
                  type="button"
                  className="text-sm text-white/80 transition hover:text-white"
                  onClick={() => void logout()}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="text-sm text-white/70 transition hover:text-white">
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
          <div className="border-t border-white/10 px-5 py-4 md:hidden">
            <nav className="flex flex-col gap-4" aria-label="Mobile">
              {isAuthenticated ? (
                <>
                  <span className="text-base text-white/70">{user?.name || user?.email}</span>
                  <Link href="/members" className="text-base text-white" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
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
                  <Link href="/register" className="text-base text-white/70" onClick={() => setMenuOpen(false)}>
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

      {children}

      <footer className="bg-[var(--color-navy-light)] py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-2 md:px-8 lg:grid-cols-5">
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

        <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 px-5 pt-8 md:flex md:items-center md:justify-between md:px-8">
          <p className="text-center text-xs text-white/40 md:text-left">
            &copy; {new Date().getFullYear()} Resource Insider. All rights reserved.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 md:mt-0">
            <a href="#" className="text-xs text-white/40 hover:text-white">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-white/40 hover:text-white">
              Terms of Use
            </a>
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
