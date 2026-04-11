import { useState } from 'react'
import { ChevronLeft, ChevronRight, Shield, Eye, Lightbulb, Bell, Users, FileText, Mic, MessageCircle, RefreshCw, Network } from 'lucide-react'
import { BtnTeal, CheckIcon } from '@/components/shared'

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

const MEMBERSHIP_FEATURES = [
  'A full year of curated deal flow in the natural resources sector',
  'High-quality, independent research reports for each deal',
  'Invest alongside our team on the exact same terms as us',
  'Bi-weekly updates on past, present & future opportunities',
  'Direct communication with Jamie & the Resource Insider team',
  'Private members-only investor forum',
]

function PricingCard() {
  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-lg">
      <p className="text-sm font-bold uppercase tracking-wider text-[var(--color-body)]">Annual Subscription</p>
      <p className="mt-4 font-[family-name:var(--font-display)] text-6xl font-semibold text-[var(--color-heading)]">$2999</p>
      <ul className="mt-8 space-y-3 text-left text-sm text-[var(--color-body)]">
        {MEMBERSHIP_FEATURES.map((f) => (
          <li key={f} className="flex gap-3">
            <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-teal)]" />
            {f}
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <BtnTeal className="w-full py-4 text-base">Join Resource Insider</BtnTeal>
      </div>
      <p className="mt-4 text-xs text-[var(--color-muted)]">
        By continuing, you agree to Resource Insider&rsquo;s Terms &amp; Conditions and <a href="https://resourceinsider.com/privacy-policy-2/" className="text-[var(--color-teal)]" target="_blank" rel="noreferrer">Privacy Policy</a>.
      </p>
    </div>
  )
}

export default function JoinPage() {
  const [tIndex, setTIndex] = useState(0)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const prevT = () => setTIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const nextT = () => setTIndex((i) => (i + 1) % TESTIMONIALS.length)

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--color-navy)]">
        <div className="pointer-events-none absolute inset-0 bg-[url('/mining-landscape-1.png')] bg-cover bg-center opacity-25" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-navy)]/60 via-[var(--color-navy)]/30 to-[var(--color-navy)]/80" aria-hidden />
        <div className="relative mx-auto max-w-3xl px-5 py-24 text-center md:px-8 md:py-32">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-teal)]">Looking to invest in natural resources this year?</p>
          <h1 className="mt-6 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.15] text-white md:text-5xl lg:text-[3.5rem]">
            Invest in the Best Opportunities in Mining, Energy &amp; Infrastructure
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70">
            Private deals, deep due diligence, and insider terms &ndash; from a team that invests alongside you.
          </p>
          <div className="mt-10">
            <a href="#pricing"><BtnTeal className="px-10 py-4 text-base">Join Resource Insider</BtnTeal></a>
          </div>
          <p className="mt-6 text-sm font-medium text-white/60">Trusted by 170+ Accredited Investors</p>
        </div>
      </section>

      {/* Resource boom */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">
            The Resource Boom Is Coming&mdash;Will You Miss It?
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--color-body)]">
            <p>The smartest investors are moving capital into sectors the world can&rsquo;t live without: mining, energy, and infrastructure.</p>
            <p>But there&rsquo;s a catch &mdash; the best deals in these sectors aren&rsquo;t found in public markets. They go to institutional investors and industry insiders. By the time they&rsquo;re public, the terms have changed and the upside has been diluted.</p>
            <p>If you don&rsquo;t have deep technical knowledge, industry connections, and negotiating leverage, you&rsquo;ll never see the opportunities that can truly change your wealth trajectory.</p>
          </div>
        </div>
      </section>

      {/* Get into deals */}
      <section className="bg-[var(--color-light-bg)] py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">
            Get Into the Deals Driving the Next Decade of Growth
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--color-body)]">
            <p>Resource Insider connects accredited investors to private placements in mining, energy, and infrastructure &mdash; the same deals we&rsquo;re investing in ourselves.</p>
            <p>We source them through decades of industry experience, negotiate favorable terms, and back them with our own capital.</p>
            <p>Then we give you the full picture: the technical due diligence, the risk analysis, and the clear investment thesis &mdash; so you can act with clarity and conviction.</p>
          </div>
        </div>
      </section>

      {/* When you join */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">
            When You Join Resource Insider, You&hellip;
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Eye, t: 'Access Deals Most Investors Never See', d: 'Get access to private placements and opportunities most investors never see\u2014often on terms normally reserved for industry insiders.' },
              { icon: Users, t: 'Align with Experienced Professionals', d: 'Partner with a team of engineers and finance professionals who invest their own capital in every deal they recommend.' },
              { icon: Lightbulb, t: 'Invest With Clarity, Not Guesswork', d: 'Every opportunity is vetted through deep technical due diligence and decades of sector experience.' },
              { icon: Shield, t: 'Protect and Grow Your Wealth', d: 'Position your capital in mining, energy, and infrastructure\u2014sectors we believe are entering a decade-long bull market.' },
              { icon: Bell, t: 'Stay Ahead of the Market', d: 'Receive timely updates, risk assessments, and on-the-ground intelligence\u2014so you can move before the crowd does.' },
            ].map((c) => {
              const Icon = c.icon
              return (
                <div key={c.t} className="rounded border border-gray-100 bg-[var(--color-light-bg)] p-8 text-center shadow-sm">
                  <Icon className="mx-auto h-10 w-10 text-[var(--color-teal)]" strokeWidth={1.5} />
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold not-italic text-[var(--color-heading)]">{c.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-body)]">{c.d}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4-step process */}
      <section className="bg-[var(--color-navy)] py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-white md:text-4xl">
            You Don&rsquo;t Have to Be a Billionaire to Invest Like One
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-white/60">Our 4-step process puts institutional-level deals within reach of individual investors.</p>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { n: 1, t: 'Join Resource Insider', d: 'Become a member and get access to current and future private placements, member-only content, and our complete deal archive.' },
              { n: 2, t: 'Review Opportunities', d: 'We send you detailed breakdowns of every deal we\u2019re investing in\u2014the thesis, structure, and steps to participate.' },
              { n: 3, t: 'Invest on Your Terms', d: 'You invest only when a deal fits your goals and risk profile. You\u2019ll always know exactly what you\u2019re getting into, and there\u2019s never pressure to invest.' },
              { n: 4, t: 'Stay Informed', d: 'We don\u2019t disappear after the deal closes. You\u2019ll get ongoing updates through the full investment cycle\u2014so you know when to hold, when to exit, and what\u2019s coming next.' },
            ].map((step) => (
              <div key={step.n} className="flex flex-col overflow-hidden rounded bg-white/5 border border-white/10">
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-teal)]">Step {step.n}</p>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold not-italic text-white">{step.t}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{step.d}</p>
                </div>
                <div className="h-1.5 bg-gradient-to-r from-[var(--color-navy)] to-[var(--color-teal)]" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership access */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">
            Your Membership Gives You Access To
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FileText, t: 'Private Deals in Mining, Energy & Infrastructure', d: 'Opportunities most investors never see\u2014curated, vetted, and structured by our team. You see the same deals we\u2019re investing in ourselves.' },
              { icon: Lightbulb, t: 'Clear, Actionable Deal Reports', d: 'Every opportunity comes with a detailed, plain-language report with a clear investment thesis, project risks, and key catalysts\u2014so you can act with conviction.' },
              { icon: Mic, t: 'Interviews with Management', d: 'We have direct conversations with the founders and operators behind each deal and then release them to you\u2014unfiltered and straight from the source.' },
              { icon: MessageCircle, t: 'Members-Only Q&A Videos', d: 'After a deal report is released, members submit questions. We record detailed, thoughtful answers and share them with the entire community.' },
              { icon: RefreshCw, t: 'Ongoing Deal Updates', d: 'From the moment we invest to the point of exit, you\u2019ll receive updates on every deal\u2014key milestones, changes, and our latest thinking on the position.' },
              { icon: Network, t: 'A Network of Like-Minded Investors', d: 'Get access to a private network of serious investors who think the way you do. Exchange ideas, share insights, and connect directly with our team.' },
            ].map((c) => {
              const Icon = c.icon
              return (
                <div key={c.t} className="rounded border border-gray-100 bg-[var(--color-light-bg)] p-8 text-center shadow-sm">
                  <Icon className="mx-auto h-10 w-10 text-[var(--color-teal)]" strokeWidth={1.5} />
                  <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold not-italic text-[var(--color-heading)]">{c.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-body)]">{c.d}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Not for everyone */}
      <section className="bg-[var(--color-light-bg)] py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">
            We&rsquo;re Not for Everyone&hellip; and That&rsquo;s the Point
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--color-body)]">
            <p>Resource Insider is an independent research service built for a very specific type of investor. It&rsquo;s not for everyone &mdash; and that&rsquo;s by design.</p>
            <p>We work with accredited investors who are intellectually curious, make their own decisions, and take action when opportunity strikes. Our members want to understand the deals they&rsquo;re in, aren&rsquo;t afraid to ask questions, and have a taste for adventure.</p>
            <p>It&rsquo;s important to understand: this is not buying shares of Apple or Tesla. This is risk capital focused on entrepreneurial ventures with the potential for multi-time returns &mdash; and the risk of partial or total losses. That&rsquo;s why we only back companies with real assets, proven leadership, and structures that give us the best possible odds.</p>
            <p>If that excites you, and you&rsquo;re ready to invest in the sectors the world can&rsquo;t live without, you&rsquo;ll fit right in here.</p>
          </div>
        </div>
      </section>

      {/* Pricing 1 */}
      <section id="pricing" className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">
            Become a Resource Insider Member Today
          </h2>
          <div className="mt-12"><PricingCard /></div>
        </div>
      </section>

      {/* Money-back guarantee */}
      <section className="bg-[var(--color-light-bg)] py-16 md:py-24">
        <div className="mx-auto max-w-xl px-5 text-center md:px-8">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">30-Day No-Questions-Asked</h2>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold not-italic text-[var(--color-teal)]">Money-Back Guarantee</h3>
          <p className="mt-6 text-[15px] leading-relaxed text-[var(--color-body)]">
            Not sure if Resource Insider is right for you? Try it risk-free for 30 days. If within 30 days you decide Resource Insider isn&rsquo;t for you, we&rsquo;ll refund your full membership fee &mdash; no questions asked.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">
            Trusted by 170+ Accredited Investors
          </h2>
          <div className="relative mt-12 rounded-lg bg-[var(--color-light-bg)] px-8 py-10 shadow-lg md:px-16 md:py-14">
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

      {/* FAQ */}
      <section className="bg-[var(--color-light-bg)] py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <h2 className="text-center font-[family-name:var(--font-display)] text-3xl font-bold not-italic text-[var(--color-heading)] md:text-4xl">Frequently Asked Questions</h2>
          <div className="mt-12 divide-y divide-gray-200 border-y border-gray-200">
            {FAQ_ITEMS.map((item, i) => {
              const open = openFaq === i
              return (
                <div key={item.q}>
                  <button type="button" className="flex w-full items-center justify-between gap-4 py-5 text-left text-[15px] font-semibold text-[var(--color-heading)]" onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                    {item.q}
                    <span className="shrink-0 text-lg text-[var(--color-heading)]">{open ? '\u2212' : '+'}</span>
                  </button>
                  {open && <div className="pb-5 text-sm leading-relaxed text-[var(--color-body)]">{item.a}</div>}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Jamie closing */}
      <section className="bg-[var(--color-navy)] py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8 text-center">
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold not-italic text-white md:text-3xl">
            If you&rsquo;ve made it this far, you know where the world is headed&mdash;toward a future built on mining, energy, and infrastructure.
          </h2>
          <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-white/70 text-left">
            <p className="font-semibold text-white">And the smartest way to position yourself for that future is&hellip;</p>
            <p>To invest early in high-quality private placements with favorable terms &mdash; deals most investors will never hear about &mdash; backed by real assets, proven teams, and deep technical due diligence.</p>
            <p>So if you&rsquo;re ready to put your capital to work in the same opportunities we&rsquo;re investing in ourselves&hellip;</p>
            <p>If you want the clarity and conviction to act before the crowd does&hellip;</p>
            <p>Then I invite you to join me inside Resource Insider.</p>
            <p>I&rsquo;m looking forward to investing alongside you.</p>
          </div>
          <div className="mt-8 text-left">
            <p className="font-bold text-white">Jamie Keech</p>
            <p className="text-sm text-white/60">CIO &amp; Founder of Resource Insider</p>
          </div>
        </div>
      </section>

      {/* Final pricing */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-5 md:px-8">
          <p className="text-center text-[15px] leading-relaxed text-[var(--color-body)]">
            Don&rsquo;t miss your chance to be part of a small group of accredited investors positioning for the future of resources.
          </p>
          <div className="mt-12"><PricingCard /></div>
          <p className="mx-auto mt-8 max-w-lg text-center text-sm font-medium text-[var(--color-teal)]">
            Membership is limited to accredited investors. Secure your spot and get immediate access to our next deal.
          </p>
        </div>
      </section>
    </>
  )
}
