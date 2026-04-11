import Link from 'next/link'
import { useRouter } from 'next/router'
import { BLOG_POSTS } from '@/data/blogPosts'
import { SITE_PAD_X } from '@/lib/site-shell'

export default function BlogPostPage() {
  const router = useRouter()
  const slug = typeof router.query.slug === 'string' ? router.query.slug : undefined
  const post = slug ? BLOG_POSTS.find((p) => p.slug === slug) : undefined

  if (!router.isReady) {
    return (
      <section className="bg-white py-24 text-center">
        <p className="text-[var(--color-body)]">Loading…</p>
      </section>
    )
  }

  if (!post) {
    return (
      <section className="bg-white py-24 text-center">
        <h1 className="text-3xl font-semibold text-[var(--color-heading)]">Post not found</h1>
        <Link href="/blog" className="mt-6 inline-block text-[var(--color-teal)] hover:underline">
          &larr; Back to Blog
        </Link>
      </section>
    )
  }

  return (
    <>
      <section className="bg-[var(--color-navy)] py-16 md:py-20">
        <div className={`mx-auto max-w-3xl ${SITE_PAD_X}`}>
          <Link href="/blog" className="text-sm text-[var(--color-teal)] hover:underline">
            &larr; Back to Blog
          </Link>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl font-bold leading-tight text-white md:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-sm text-white/50">{post.date}</p>
        </div>
      </section>

      <article className="bg-white py-12 md:py-16">
        <div className={`mx-auto max-w-3xl ${SITE_PAD_X}`}>
          <div className="space-y-5 text-[15px] leading-relaxed text-[var(--color-body)]">
            {post.body.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8">
            <p className="font-bold text-[var(--color-heading)]">Jamie Keech</p>
            <p className="text-sm text-[var(--color-body)]">CIO &amp; Founder of Resource Insider</p>
          </div>
        </div>
      </article>
    </>
  )
}
