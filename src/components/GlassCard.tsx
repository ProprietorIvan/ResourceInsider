import type { ReactNode } from 'react'

export default function GlassCard({
  children,
  className = '',
  hover = false,
  glow = false,
  glowVariant = 'teal',
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
  glowVariant?: 'teal' | 'gold'
}) {
  const base = 'glass-card'
  const hoverCls = hover ? 'glass-card--hover' : ''
  const glowCls =
    glow
      ? glowVariant === 'gold'
        ? 'glow-border glow-border--gold'
        : 'glow-border glow-border--teal'
      : ''
  return (
    <div className={`${base} ${hoverCls} ${glowCls} ${className}`.trim()}>
      {children}
    </div>
  )
}
