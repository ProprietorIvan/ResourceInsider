import { useState } from 'react'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  Landmark,
  Pickaxe,
  BadgeDollarSign,
  Users,
  Handshake,
  HardHat,
} from 'lucide-react'
import { BtnTeal } from '@/components/shared'
import { SITE_SHELL_X } from '@/lib/site-shell'

const TESTIMONIALS = [
  { quote: 'I\u2019ve invested in ten different opportunities I never would\u2019ve found on my own. Each one came with clear, expert analysis. I know I\u2019m investing alongside Jamie on the same terms\u2014and that makes all the difference.', name: 'Gary Morgan', role: 'Member', title: 'Serious Research, Serious Results' },
  { quote: 'Jamie doesn\u2019t just recommend deals\u2014he invests in them, too. He has the skill to find high-upside, low-risk opportunities and the integrity to stand behind them. That\u2019s rare in this business.', name: 'Mark Butler', role: 'Member', title: 'Aligned Incentives and Unmatched Integrity' },
  { quote: 'Resource Insider is the only service I trust to combine a big-picture macro view with on-the-ground insight. The results speak for themselves\u2014far better than anything else out there.', name: 'Lee Hall', role: 'Member', title: 'Smarter Strategies, Better Outcomes' },
  { quote: 'Jamie and the team see market trends long before the crowd. They work hard, invest their own money, and always act with integrity. I\u2019m proud to invest alongside them.', name: 'Bill Crowley', role: 'Member', title: 'Experts You Actually Want to Follow' },
  { quote: 'Jamie\u2019s been part of multi-billion-dollar resource companies. He\u2019s built an incredible network and gives his members access to the kinds of deals most people will never see.', name: 'Nolan Watson', role: 'CEO, Sandstorm Gold', title: 'Unmatched Deal Flow from Real Industry Leaders' },
  { quote: 'I hired Jamie to help build what\u2019s now Equinox Gold. He\u2019s smart, driven, and knows how to structure and evaluate real deals. I\u2019ve invested with him\u2014and will again.', name: 'Greg Smith', role: 'President, Equinox Gold', title: 'Built by Proven Operators' },
  { quote: 'Jamie has an uncanny ability to build powerful networks and uncover unique opportunities in the sector. He brings serious energy and creativity to everything he does.', name: 'Marcel de Groot', role: 'President, Pathway Capital', title: 'High-Level Access You Can Trust' },
  { quote: 'I worked with Jamie while building a fast-growing mining company. He blends technical skill, financial insight, and strong ethics\u2014making him a valuable partner in any deal.', name: 'Dan O\u2019Flaherty', role: 'CEO, Maverix Metals', title: 'A Partner You Can Rely On' },
]

const STEPS = [
  { n: 1, title: 'Become an Insider', body: 'Gain immediate access to our premium research and analysis\u2014so you can make informed decisions with expert-level insight.' },
  { n: 2, title: 'See Where We\u2019re Investing', body: 'Get full transparency into the deals we\u2019re backing\u2014so you can follow the smart money and understand every move before committing.' },
  { n: 3, title: 'Invest Alongside Us', body: 'Join us in select opportunities\u2014so you can build your portfolio on the same terms, with the same conviction, as seasoned technical and financial professionals.' },
  { n: 4, title: 'Stay Informed, Entry to Exit', body: 'We share how we manage each position\u2014so you know when we\u2019re holding, exiting, or re-evaluating a deal, and why.' },
  { n: 5, title: 'Protect & Grow Your Wealth', body: 'With the right guidance and timing, your investments deliver growth and resilience across market cycles\u2014for yourself, your family, and your future.' },
]

const FAQ_ITEMS = [
  { q: 'Can I trust your team\u2019s expertise?', a: 'Absolutely. We\u2019re engineers and finance professionals who\u2019ve built multiple companies across mining, energy, infrastructure, and renewables. Our research comes from years in the field\u2014not behind a desk.' },
  { q: 'What if I lose money?', a: 'All investments carry risk, but ours are backed by deep due diligence, transparent structures, and real skin in the game. We invest our own capital alongside yours in every deal.' },
  { q: 'Are these investments actually worth it?', a: 'We don\u2019t just find good deals\u2014we structure them for value. Many of our opportunities offer better terms than what\u2019s available on the public market and have significantly outperformed traditional investments.' },
  { q: 'Why can\u2019t I just do this through my financial advisor?', a: 'Most advisors don\u2019t have access to these types of deals\u2014or the technical skills to evaluate them. We\u2019re operators first, not salespeople, and we go where mainstream finance can\u2019t.' },
  { q: 'What if I don\u2019t have time to do due diligence?', a: 'That\u2019s exactly why we exist. We handle the technical reviews, interviews, and deal structuring\u2014so you can act confidently without doing the heavy lifting.' },
  { q: 'Is this just another investment newsletter\u2014or a marketing pitch?', a: 'Not even close. We\u2019re operators, not marketers. Our team comes from inside the mining and finance sectors\u2014not the world of financial media.' },
  { q: 'Do I have to invest in every deal you share?', a: 'No. You invest only when it fits your goals and risk profile. There\u2019s no pressure, ever.' },
  { q: 'Do I need to be an accredited investor?', a: 'Only for our private deal flow. If you\u2019re accessing our curated portfolios of publicly traded resource companies, no accreditation is required.' },
  { q: 'How do I know when to sell?', a: 'We don\u2019t just bring you the entry\u2014we guide you through the full life cycle, including when to hold, exit, or take profits.' },
  { q: 'What kind of returns have your past deals delivered?', a: 'While past performance doesn\u2019t guarantee future results, many of our investments have significantly outperformed traditional portfolios. We can share examples on request.' },
  { q: 'What\u2019s the minimum investment amount?', a: 'Some deals start as low as CAD$5,000. Others may require more. We always disclose terms upfront so you can decide what fits your goals.' },
  { q: 'What is a private placement?', a: 'A private placement lets you buy shares directly from a company\u2014usually at a discount and with better terms than public buyers receive.' },
  { q: 'Are these deals only in Canada?', a: 'No. We evaluate opportunities globally across mining, energy, and infrastructure. Canada is a core region, but not the only one.' },
  { q: 'What currencies are deals priced in?', a: 'Most are in CAD or USD. All terms are clearly outlined in each opportunity report.' },
  { q: 'Can I invest through my retirement account?', a: 'In many cases, yes\u2014depending on your account provider and the deal structure. We can help guide you through the setup.' },
  { q: 'How are deals vetted?', a: 'Each deal goes through a detailed due diligence process including technical review, management interviews, and insider-level scrutiny.' },
  { q: 'How often do you share new opportunities?', a: 'We don\u2019t push volume\u2014we focus on quality. You can expect 1 to 5 carefully vetted opportunities per year.' },
  { q: 'What if I\u2019ve never invested in commodities before?', a: 'That\u2019s fine. We walk you through each opportunity in plain language and provide background context and support if you need it.' },
  { q: 'Do I need to live in a specific country to invest?', a: 'Not necessarily. Our members come from all over the world. We\u2019ll help you understand if a deal is suitable for your jurisdiction.' },
  { q: 'Can I talk to someone before joining?', a: 'Yes. Just reach out and we\u2019ll set up a quick call to walk through any questions you have.' },
]

const HERO_STATS = [
  { over: 'Over', num: '50', label: 'Deals Evaluated Annually' },
  { over: 'Trusted by', num: '170+', label: 'of Accredited Investors' },
  { over: 'More than', num: '20', label: 'Years of On-the-Ground Due Diligence' },
] as const

const WHAT_YOU_GET = [
  { icon: Landmark, t: 'Deals Usually Limited to Institutional Investors', d: 'Participate in deals normally closed to the public\u2014so you break into the circles that usually require connections or capital.' },
  { icon: Pickaxe, t: 'Direct Investment into Mining and Energy', d: 'Go beyond ETFs and passive exposure\u2014so you can target real upside with real ownership.' },
  { icon: BadgeDollarSign, t: 'Structured Deals, Priced Right', d: 'Increase upside through better deal terms\u2014so you stretch your dollars further and unlock hidden value.' },
  { icon: Users, t: 'Unmatched Access to Management', d: 'We speak directly with CEOs and operators. You get answers, on the record, and distilled for decision-making.' },
  { icon: Handshake, t: 'Aligned Interests Through Co-Investment', d: 'Share the same risk and reward as the pros\u2014so you\u2019re not betting alone\u2014you\u2019re aligning with experts.' },
  { icon: HardHat, t: 'Engineer-Led Due Diligence', d: 'You\u2019re protected by 15+ years of on-the-ground expertise, so you can avoid costly mistakes in complex projects.' },
]

export default function App() {
  const [tIndex, setTIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const prevT = () => setTIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const nextT = () => setTIndex((i) => (i + 1) % TESTIMONIALS.length)

  return (
    <>
      {/* Hero — full viewport height, stats overlaid on image near bottom */}
      <section id="invest" className="relative min-h-svh overflow-hidden bg-[var(--color-navy)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/files/8d43d0c0113dfc1e6499bc3e90718d10.jpg')] bg-cover bg-center opacity-45"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-navy)]/80 via-[var(--color-navy)]/50 to-transparent"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-3xl px-5 pt-32 pb-8 text-center md:px-8 md:pt-40 md:pb-10 lg:pt-44">
          <h1 className="font-[family-name:var(--font-display)] text-4xl leading-[1.12] font-bold not-italic text-white md:text-5xl lg:text-[3.35rem] lg:leading-[1.1]">
            Invest in the Best Opportunities in Mining, Energy &amp; Infrastructure
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-white/70 md:mt-6">
            Resource Insider gives serious investors access to a curated portfolio of public companies and private deals most never see &mdash; so you can invest in natural resources like an industry insider.
          </p>
          <form
            id="join"
            className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:mt-10 sm:flex-row md:max-w-xl"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="sr-only" htmlFor="hero-email">Email</label>
            <input
              id="hero-email"
              type="email"
              placeholder="Enter Your Email"
              className="min-h-[48px] flex-1 rounded border border-gray-300/90 bg-white px-4 text-[var(--color-heading)] placeholder:text-gray-400 focus:border-[var(--color-teal)] focus:outline-none"
            />
            <BtnTeal type="submit" className="min-h-[48px] shrink-0 whitespace-nowrap">
              Join The List
            </BtnTeal>
          </form>
          <p className="mt-4 text-sm font-medium text-white/60 sm:mt-5">
            Free research, new deals, and expert insights&mdash;straight to your inbox.
          </p>
        </div>

        {/* Stats — on the image, with space below so you see landscape at the bottom */}
        <div className="relative z-10 mx-auto max-w-5xl px-5 pb-16 md:px-8 md:pb-20 lg:pb-24">
          <div className="grid grid-cols-1 divide-y divide-[var(--color-navy)]/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                className="landing-hero-stat-cell bg-[#c8d4de]/80 px-6 py-5 text-center backdrop-blur-lg sm:py-6 md:px-10"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-navy)]/45">
                  {s.over}
                </p>
                <p className="mt-1 text-[2.5rem] font-bold leading-none tracking-tight text-[var(--color-heading)] md:text-[3rem]">
                  {s.num}
                </p>
                <p className="mt-1.5 text-[11px] font-medium leading-snug text-[var(--color-navy)]/60 md:text-[12px]">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resource boom */}
      <section id="about" className="bg-white py-16 md:py-24">
        <div className={`mx-auto grid items-center gap-12 md:grid-cols-2 md:gap-16 ${SITE_SHELL_X}`}>
          <div className="order-2 md:order-1">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold not-italic leading-tight text-[var(--color-heading)] md:text-4xl">The Resource Boom Is Coming&mdash;Will You Miss It?</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--color-body)]">
              <p>Global demand for real assets is surging&mdash;and the smartest investors are moving fast. But most portfolios are still overweight tech stocks with bloated valuations, chasing growth in all the wrong places.</p>
              <p>Meanwhile, overlooked sectors like mining, energy, and infrastructure are gaining ground&mdash;quietly, and quickly.</p>
              <p>You might sense the shift. Maybe you&rsquo;ve tried digging into deals yourself. But the ones with real upside? They&rsquo;re hard to find&mdash;and even harder to trust.</p>
              <p className="font-semibold text-[var(--color-heading)]">This is where most investors get left behind.</p>
              <p className="font-semibold text-[var(--color-heading)]">You don&rsquo;t have to be one of them.</p>
            </div>
          </div>
          <div className="order-1 md:order-2"><div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-[url('/mining-landscape-1.png')] bg-cover bg-center" role="img" aria-label="Mining operation" /></div>
        </div>
      </section>

      {/* Real assets */}
      <section id="strategy" className="bg-[var(--color-light-bg)] py-16 md:py-24">
        <div className={`mx-auto grid items-center gap-12 md:grid-cols-2 md:gap-16 ${SITE_SHELL_X}`}>
          <div><div className="aspect-[4/3] w-full overflow-hidden rounded-lg bg-[url('/mining-landscape-2.png')] bg-cover bg-center" role="img" aria-label="Mining landscape" /></div>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold not-italic leading-tight text-[var(--color-heading)] md:text-4xl">Invest in Real Assets That Power the World</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--color-body)]">
              <p>That gut instinct telling you to look beyond the mainstream playbook? You&rsquo;re right to follow it.</p>
              <p>At Resource Insider, we help serious investors act on that instinct&mdash;and capitalize on overlooked opportunities in mining, energy, and infrastructure.</p>
              <p>With backgrounds in engineering and global finance, our insights are grounded in technical due diligence and hard-won, boots-on-the-ground experience. We vet every deal ourselves, invest our own capital, and share only what we believe in&mdash;so you don&rsquo;t waste time chasing hype.</p>
              <p className="font-medium text-[var(--color-heading)]">You&rsquo;re not alone in this market.</p>
              <p className="font-bold text-[var(--color-heading)]">If you&rsquo;re ready to move differently, this is where you start.</p>
            </div>
            <div className="mt-8"><Link href="/join"><BtnTeal>Join The List</BtnTeal></Link></div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="bg-white py-16 md:py-24">
        <div className={`mx-auto grid items-center gap-12 md:grid-cols-2 md:gap-16 ${SITE_SHELL_X}`}>
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold not-italic leading-tight text-[var(--color-heading)] md:text-4xl">A Note from Our Founder</h2>
            <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--color-body)]">
              <p>If you&rsquo;re reading this, you probably sense that something is broken in the world of resources, energy, and industry. You&rsquo;re not alone.</p>
              <p>I created Resource Insider because I was tired of watching capital chase hype while critical sectors&mdash;mining, energy, infrastructure&mdash;were neglected, misunderstood, or outright vilified.</p>
              <p>My mission is simple: to cut through the noise and share clear, actionable insight on where to invest, what to watch, and who&rsquo;s actually building the future. I don&rsquo;t do hype.</p>
              <p>If you&rsquo;re looking for unfiltered, experience-backed truth about resources and investing, you&rsquo;re in the right place.</p>
            </div>
            <div className="mt-8">
              <p className="text-lg font-bold text-[var(--color-heading)]">Jamie Keech</p>
              <p className="text-sm text-[var(--color-body)]">CIO &amp; Founder of Resource Insider</p>
            </div>
          </div>
          <div className="flex justify-center">
            <img src="/jamie-keech.png" alt="Jamie Keech, CIO & Founder of Resource Insider" className="w-full max-w-sm md:max-w-md" />
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="bg-[var(--color-navy)] py-16 md:py-24">
        <div className={`mx-auto ${SITE_SHELL_X}`}>
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-white md:text-4xl">Why Savvy Investors Choose Resource Insider</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { t: 'Invest Early, When It\nMatters Most', d: 'We help you get in ahead of the crowd\u2014so you can maximize returns and make the most of asymmetric opportunities.' },
              { t: 'Make Smart Moves\nin a Complex Sector', d: 'With expert field research and technical due diligence, you avoid costly mistakes and invest with the clarity of an insider.' },
              { t: 'Backed by Real Skin\nin the Game', d: 'We put our own capital into every deal\u2014so your success is our success, and your risk is our risk.' },
            ].map((card) => (
              <div key={card.t} className="border border-white/10 bg-[var(--color-navy-light)] p-8 text-center">
                <h3 className="whitespace-pre-line font-[family-name:var(--font-display)] text-xl font-bold not-italic text-white md:text-2xl">{card.t}</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/60">{card.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 md:py-24">
        <div className={`mx-auto ${SITE_SHELL_X}`}>
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">How Resource Insider Works</h2>
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step) => (
              <div key={step.n} className="flex flex-col overflow-hidden rounded bg-[var(--color-light-bg)]">
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-body)]">Step {step.n}</p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-lg font-bold not-italic text-[var(--color-heading)] md:text-xl">{step.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-body)]">{step.body}</p>
                </div>
                <div className="h-1.5 bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-teal)]" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-[var(--color-light-bg)] py-16 md:py-24">
        <div className={`mx-auto ${SITE_SHELL_X}`}>
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">Trusted by Investors. Respected by Operators.</h2>
          <div className="relative mx-auto mt-12 max-w-4xl rounded-lg bg-white px-8 py-10 shadow-lg md:px-16 md:py-14">
            <span className="pointer-events-none absolute left-6 top-4 font-[family-name:var(--font-display)] text-[120px] leading-none text-[var(--color-teal)]/10 md:left-10 md:top-2 md:text-[160px]" aria-hidden>&ldquo;</span>
            <span className="pointer-events-none absolute bottom-0 right-6 font-[family-name:var(--font-display)] text-[120px] leading-none text-[var(--color-teal)]/10 md:right-10 md:text-[160px]" aria-hidden>&rdquo;</span>
            <p className="relative text-center font-[family-name:var(--font-display)] text-xl font-bold not-italic text-[var(--color-teal)] md:text-2xl">{TESTIMONIALS[tIndex].title}</p>
            <blockquote className="relative mt-6 text-center text-base leading-relaxed text-[var(--color-body)] md:text-lg">{TESTIMONIALS[tIndex].quote}</blockquote>
            <div className="relative mt-8 text-center">
              <p className="font-bold text-[var(--color-heading)]">{TESTIMONIALS[tIndex].name}</p>
              <p className="text-sm text-[var(--color-body)]">{TESTIMONIALS[tIndex].role}</p>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-center gap-5">
            <button type="button" onClick={prevT} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-teal)] text-white transition hover:bg-[var(--color-teal-hover)]" aria-label="Previous"><ChevronLeft className="h-5 w-5" /></button>
            <div className="flex gap-2">{TESTIMONIALS.map((_, i) => (<button key={i} type="button" className={`h-3 w-3 rounded-full transition ${i === tIndex ? 'bg-[var(--color-teal)]' : 'bg-gray-300'}`} onClick={() => setTIndex(i)} aria-label={`Testimonial ${i + 1}`} />))}</div>
            <button type="button" onClick={nextT} className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-teal)] text-white transition hover:bg-[var(--color-teal-hover)]" aria-label="Next"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="bg-white py-16 md:py-24">
        <div className={`mx-auto ${SITE_SHELL_X}`}>
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">What You Get with Resource Insider</h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_YOU_GET.map((item) => { const Icon = item.icon; return (
              <div key={item.t} className="rounded border border-gray-100 bg-[var(--color-light-bg)] p-8 text-center shadow-sm">
                <Icon className="mx-auto h-10 w-10 text-[var(--color-teal)]" strokeWidth={1.5} />
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold not-italic text-[var(--color-heading)]">{item.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-body)]">{item.d}</p>
              </div>
            ) })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq-section" className="bg-white py-16 md:py-24">
        <div className={`mx-auto ${SITE_SHELL_X}`}>
          <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-12 divide-y divide-gray-200 border-y border-gray-200">
            {FAQ_ITEMS.map((item, i) => { const open = openFaq === i; return (
              <div key={item.q}>
                <button type="button" className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-semibold text-[var(--color-heading)]" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                  {item.q}
                  <span className="shrink-0 text-lg text-[var(--color-heading)]">{open ? '\u2212' : '+'}</span>
                </button>
                {open && <div className="pb-5 text-sm leading-relaxed text-[var(--color-body)]">{item.a}</div>}
              </div>
            ) })}
          </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section id="join-bottom" className="bg-[var(--color-navy)] py-16 md:py-24">
        <div className={`mx-auto ${SITE_SHELL_X}`}>
          <div className="mx-auto max-w-xl">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-white md:text-4xl">Get Insights into Natural Resource Investing</h2>
          <p className="mx-auto mt-6 max-w-lg text-center text-white/60">Join <strong className="text-white">10,000+</strong> investors staying ahead on mining, energy, and infrastructure&mdash;plus early notice when new opportunities go live.</p>
          <form className="mt-10 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="mb-1 block text-sm font-medium text-white/70">First Name *</span><input type="text" placeholder="First Name" className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-[var(--color-teal)] focus:outline-none" /></label>
              <label className="block"><span className="mb-1 block text-sm font-medium text-white/70">Last Name *</span><input type="text" placeholder="Last Name" className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-[var(--color-teal)] focus:outline-none" /></label>
            </div>
            <label className="block"><span className="mb-1 block text-sm font-medium text-white/70">Are you an accredited investor? *</span>
              <select defaultValue="not-sure" className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white focus:border-[var(--color-teal)] focus:outline-none [&>option]:text-[var(--color-heading)]"><option value="yes">Yes</option><option value="no">No</option><option value="not-sure">Not Sure</option></select>
            </label>
            <label className="block"><span className="mb-1 block text-sm font-medium text-white/70">Email *</span><input type="email" placeholder="Enter Your Email" className="w-full rounded border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-white/40 focus:border-[var(--color-teal)] focus:outline-none" /></label>
            <BtnTeal type="submit" className="w-full">Join The List</BtnTeal>
            <p className="text-center text-xs text-white/40">By clicking &ldquo;Join The List&rdquo;, you agree to our <a href="https://resourceinsider.com/privacy-policy-2/" className="text-[var(--color-teal)] underline underline-offset-2" target="_blank" rel="noreferrer">Privacy Policy</a>.</p>
          </form>
          </div>
        </div>
      </section>
    </>
  )
}
