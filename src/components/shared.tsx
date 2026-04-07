import { type ReactNode } from 'react'

export function BtnTeal({
  children,
  className = '',
  type = 'button' as const,
  disabled = false,
  onClick,
}: {
  children: ReactNode
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`rounded bg-[var(--color-teal)] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[var(--color-teal-hover)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  )
}

export function RILogo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded border border-white/30 text-xs font-bold leading-none text-white">
        <span className="text-[15px] font-bold leading-none tracking-tight">RI</span>
      </div>
      <div className="hidden text-[13px] font-semibold uppercase leading-tight tracking-[0.08em] text-white sm:block">
        <div>Resource</div>
        <div>Insider</div>
      </div>
    </div>
  )
}

export function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

export function ApplePodcastsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M5.34 0A5.328 5.328 0 000 5.34v13.32A5.328 5.328 0 005.34 24h13.32A5.328 5.328 0 0024 18.66V5.34A5.328 5.328 0 0018.66 0zm6.525 2.568c4.988 0 7.399 3.882 7.399 7.2 0 1.488-.396 2.7-.804 3.456-.408.756-.792 1.08-1.116 1.08-.396 0-.636-.324-.636-.756 0-.156.024-.348.096-.6.36-1.02.564-2.16.564-3.18 0-3.024-2.16-5.784-5.496-5.784-3.36 0-5.508 2.76-5.508 5.784 0 1.02.204 2.16.564 3.18.072.252.096.444.096.6 0 .432-.24.756-.636.756-.324 0-.708-.324-1.116-1.08-.408-.756-.804-1.968-.804-3.456-.012-3.318 2.412-7.2 7.401-7.2zm-.024 3.588c2.328 0 4.008 1.728 4.008 3.876 0 .6-.12 1.2-.336 1.776-.144.384-.384.576-.636.576-.288 0-.516-.192-.516-.516 0-.072.012-.168.048-.288.18-.564.276-1.08.276-1.548 0-1.632-1.188-2.64-2.844-2.64-1.656 0-2.844 1.008-2.844 2.64 0 .468.096.984.276 1.548.036.12.048.216.048.288 0 .324-.228.516-.516.516-.252 0-.492-.192-.636-.576a5.332 5.332 0 01-.336-1.776c0-2.148 1.68-3.876 4.008-3.876zm-.012 3.252c.816 0 1.392.6 1.392 1.416 0 .468-.192.888-.516 1.164.12.384.36 1.332.444 1.656.12.504-.12.9-.588.9h-1.476c-.468 0-.708-.396-.588-.9.084-.324.336-1.272.456-1.656a1.427 1.427 0 01-.516-1.164c0-.816.564-1.416 1.392-1.416zm0 5.22h.012c.648 0 1.26.06 1.26.06.636.072 1.104.468 1.2 1.068.096.564.168 1.356.168 2.1 0 .648-.048 1.212-.12 1.62-.108.588-.576 1.08-1.224 1.14-.3.024-.636.048-.996.048h-.6c-.36 0-.696-.024-.996-.048-.648-.06-1.116-.552-1.224-1.14a9.075 9.075 0 01-.12-1.62c0-.744.072-1.536.168-2.1.096-.6.564-.996 1.2-1.068 0 0 .612-.06 1.26-.06z" />
    </svg>
  )
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}
