import Link from 'next/link'
import { BLOG_POSTS } from '@/data/blogPosts'
import { BtnTeal } from '@/components/shared'
import { SITE_SHELL_X } from '@/lib/site-shell'

const CARD_COLORS = [
  'from-cyan-800 to-teal-900',
  'from-sky-800 to-blue-900',
  'from-emerald-800 to-green-900',
  'from-slate-700 to-slate-900',
  'from-amber-800 to-yellow-900',
  'from-indigo-800 to-violet-900',
  'from-rose-800 to-red-900',
  'from-teal-700 to-cyan-900',
]

function RiAvatar() {
  return (
    <div className="mx-auto -mt-5 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[var(--color-navy)] text-[11px] font-bold text-white shadow">
      RI
    </div>
  )
}

export default function BlogPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-navy)]">
        <div className="pointer-events-none absolute inset-0 bg-[url('/mining-landscape-2.png')] bg-cover bg-center opacity-20" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-navy)]/60 via-[var(--color-navy)]/30 to-[var(--color-navy)]/80" aria-hidden />
        <div className={`relative mx-auto ${SITE_SHELL_X}`}>
          <div className="mx-auto max-w-4xl pt-32 pb-24 text-center md:pt-36 md:pb-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-teal)]">Looking to invest in natural resources this year?</p>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.15] text-white md:text-5xl">
            Welcome to our Blog
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Private deals, deep due diligence, and insider terms &ndash; from a team that invests alongside you.
          </p>
          <div className="mt-10">
            <Link href="/join"><BtnTeal className="px-10 py-4 text-base">Join Resource Insider</BtnTeal></Link>
          </div>
          <p className="mt-6 text-sm font-medium text-white/60">Trusted by 170+ Accredited Investors</p>
          </div>
        </div>
      </section>

      {/* Blog grid */}
      <section className="bg-[var(--color-light-bg)] py-12 md:py-16">
        <div className={`mx-auto ${SITE_SHELL_X}`}>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {BLOG_POSTS.map((post, i) => (
              <article key={post.slug} className="group flex flex-col overflow-hidden rounded-lg border-2 border-[var(--color-teal)]/30 bg-white shadow-sm transition hover:shadow-md hover:border-[var(--color-teal)]/60">
                {/* Thumbnail */}
                <Link href={`/blog/${post.slug}`} className="relative block">
                  <div className={`aspect-[16/10] w-full bg-gradient-to-br ${CARD_COLORS[i % CARD_COLORS.length]} flex items-end p-4`}>
                    <p className="line-clamp-2 font-[family-name:var(--font-display)] text-lg font-bold leading-tight text-white/90 drop-shadow">
                      {post.title.length > 60 ? post.title.slice(0, 60) + '\u2026' : post.title}
                    </p>
                  </div>
                  <span className="absolute right-3 top-3 rounded bg-[var(--color-teal)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                    Blog Post
                  </span>
                </Link>

                {/* Avatar */}
                <div className="relative z-10">
                  <RiAvatar />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
                  <h2 className="text-sm font-bold leading-snug text-[var(--color-heading)]">
                    <Link href={`/blog/${post.slug}`} className="transition hover:text-[var(--color-teal)]">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-3 flex-1 text-xs leading-relaxed text-[var(--color-body)]">
                    {post.excerpt}
                  </p>
                  <Link href={`/blog/${post.slug}`} className="mt-3 inline-block text-xs font-bold uppercase tracking-wider text-[var(--color-heading)] hover:text-[var(--color-teal)]">
                    Read More &raquo;
                  </Link>
                  <p className="mt-3 border-t border-gray-100 pt-3 text-[11px] text-[var(--color-muted)]">
                    {post.date}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
