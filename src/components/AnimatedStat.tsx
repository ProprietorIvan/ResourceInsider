import { useEffect, useRef, useState } from 'react'

function easeOutQuart(t: number): number {
  return 1 - (1 - t) ** 4
}

export default function AnimatedStat({
  value,
  label,
  prefix = '',
  suffix = '',
  colorClass = 'text-white',
  glowAccent = 'teal',
  showPulse = false,
  sparkline,
}: {
  value: number
  label: string
  prefix?: string
  suffix?: string
  colorClass?: string
  glowAccent?: 'teal' | 'emerald' | 'amber'
  showPulse?: boolean
  sparkline?: number[]
}) {
  const [display, setDisplay] = useState(0)
  const startRef = useRef<number | null>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const duration = 1200
    const startVal = 0
    const endVal = value

    const tick = (now: number) => {
      if (startRef.current === null) startRef.current = now
      const elapsed = now - startRef.current
      const t = Math.min(1, elapsed / duration)
      const eased = easeOutQuart(t)
      setDisplay(startVal + (endVal - startVal) * eased)
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }
    frameRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frameRef.current)
      startRef.current = null
    }
  }, [value])

  const accentBar =
    glowAccent === 'amber'
      ? 'from-amber-400/80 to-amber-600/40'
      : glowAccent === 'emerald'
        ? 'from-emerald-400/80 to-emerald-600/40'
        : 'from-[var(--color-teal)] to-cyan-600/50'

  const spark =
    sparkline && sparkline.length > 0 ? (
      <div className="mt-3 flex h-6 items-end gap-0.5">
        {sparkline.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm bg-white/15 transition-colors group-hover:bg-[var(--color-teal)]/40"
            style={{ height: `${Math.max(12, (h / Math.max(...sparkline)) * 100)}%` }}
          />
        ))}
      </div>
    ) : null

  return (
    <div className="glass-card glass-card--hover group relative overflow-hidden rounded-xl p-5">
      <div
        className={`pointer-events-none absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r ${accentBar} opacity-90`}
        aria-hidden
      />
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
          {label}
        </p>
        {showPulse && (
          <span className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-400/90">
            <span className="pulse-dot" />
            Live
          </span>
        )}
      </div>
      <p
        className={`mt-3 font-mono-nums text-2xl font-bold tracking-tight md:text-3xl ${colorClass}`}
      >
        {prefix}
        {Number.isInteger(value)
          ? Math.round(display)
          : display.toFixed(1)}
        {suffix}
      </p>
      {spark}
    </div>
  )
}
