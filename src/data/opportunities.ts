export interface StockPick {
  slug: string
  title: string
  date: string
  readTime: string
  excerpt: string
  commodity: string
  stage: string
  location: string
  company?: string
  ticker?: string
  thesis: string[]
  status: 'active' | 'closed'
}

export interface PrivatePlacement {
  slug: string
  title: string
  date: string
  teaser: string
  commodity: string
  stage: string
  jurisdiction: string
  status: 'open' | 'closed'
  company?: string
  ticker?: string
  minInvestment?: string
  thesis: string[]
}

export interface TradeAlert {
  id: string
  date: string
  type: 'buy' | 'sell' | 'hold' | 'trim'
  title: string
  detail: string
}

export interface PortfolioPosition {
  id: string
  name: string
  ticker: string
  entryPrice: number
  currentPrice: number
  shares: number
  gainPct: number
  status: 'active' | 'closed'
}

export const STOCK_PICKS: StockPick[] = [
  {
    slug: 'immediate-upside-copper-play',
    title: 'Immediate Upside in an Overlooked Copper Play',
    date: 'Mar 28, 2026',
    readTime: '8 min',
    excerpt:
      'A small-cap copper explorer sitting on a permitted, drill-ready project in a Tier-1 jurisdiction. With copper prices near all-time highs and a catalyst-rich H2 2026, we see 3x potential.',
    commodity: 'Copper',
    stage: 'Explorer',
    location: 'British Columbia',
    company: 'Pacific Copper Corp.',
    ticker: 'PCOP.V',
    status: 'active',
    thesis: [
      'Copper demand is being driven by the global electrification megatrend, including EVs, grid infrastructure, and renewable energy systems.',
      'This company controls a 15,000-hectare land package in a prolific copper belt that hosts several past-producing mines.',
      'Recent geophysical surveys have identified three high-priority targets that share geological signatures with nearby multi-billion-pound deposits.',
      'The team includes a former executive of a major mining company who oversaw the development of a $2B copper mine.',
      'A fully funded 5,000m drill program is set to begin in Q2 2026, with initial results expected by late summer.',
      'At the current market cap, the company trades at a fraction of comparable copper explorers with similar-stage projects.',
    ],
  },
  {
    slug: 'gold-producer-rerating',
    title: 'A Mid-Tier Gold Producer Set for a Major Re-Rating',
    date: 'Mar 14, 2026',
    readTime: '11 min',
    excerpt:
      'This producing gold miner is generating strong free cash flow but trades at a steep discount to peers. A pending resource update and expansion study could close the valuation gap.',
    commodity: 'Gold',
    stage: 'Producer',
    location: 'Nevada',
    company: 'Sierra Gold Inc.',
    ticker: 'SGI.TO',
    status: 'active',
    thesis: [
      'The company operates a permitted, producing gold mine in Nevada that generated $42M in free cash flow in 2025.',
      'Current all-in sustaining costs (AISC) of $1,150/oz place it in the bottom quartile of producers globally.',
      'A 43-101 resource update is expected in April 2026 and is widely anticipated to increase measured & indicated resources by 30-40%.',
      'Management has guided to an expansion feasibility study in H2 2026 that could double annual throughput.',
      'The stock trades at 4.2x EV/EBITDA vs. a peer average of 7.8x, suggesting significant upside on a re-rating.',
      'Insider ownership sits at 18%, well above the sector median, aligning management incentives with shareholders.',
    ],
  },
  {
    slug: 'uranium-developer-energy-transition',
    title: 'Uranium Developer Positioned for the Energy Transition',
    date: 'Feb 26, 2026',
    readTime: '9 min',
    excerpt:
      'With nuclear energy gaining global policy support, this advanced uranium developer with a permitted project and offtake discussions is poised for a significant inflection.',
    commodity: 'Uranium',
    stage: 'Developer',
    location: 'Saskatchewan',
    company: 'Northern Fuel Corp.',
    ticker: 'NFC.V',
    status: 'active',
    thesis: [
      'Global nuclear power capacity is projected to grow 75% by 2040, driven by net-zero commitments and energy security concerns.',
      'The Athabasca Basin project hosts a high-grade uranium deposit with grades 10-100x the global average.',
      'A positive Preliminary Economic Assessment (PEA) was completed in 2025, showing robust economics at $70/lb U3O8.',
      'The company is in active discussions with two major utilities for binding offtake agreements.',
      'With construction permits in hand and a clear path to production by 2028, this is one of the most advanced development-stage uranium projects in North America.',
    ],
  },
  {
    slug: 'silver-lithium-hybrid',
    title: 'A Silver-Lithium Hybrid With Dual Commodity Exposure',
    date: 'Feb 10, 2026',
    readTime: '7 min',
    excerpt:
      'This explorer holds two high-quality projects across silver and lithium, offering diversified commodity exposure in a single small-cap equity.',
    commodity: 'Silver / Lithium',
    stage: 'Explorer',
    location: 'Argentina',
    status: 'closed',
    thesis: [
      'The company holds a 40,000-hectare silver project and a 12,000-hectare lithium brine project in Salta Province.',
      'Initial sampling at the silver project returned grades as high as 1,200 g/t Ag from surface outcrop, pointing to a large epithermal system.',
      'The lithium brine project sits adjacent to a producing salar operated by a global battery materials company.',
    ],
  },
  {
    slug: 'nickel-sulphide-discovery',
    title: 'Early-Stage Nickel Sulphide Discovery in Western Australia',
    date: 'Jan 22, 2026',
    readTime: '6 min',
    excerpt:
      'A grassroots nickel sulphide explorer has made a promising new discovery in the Fraser Range belt, home to some of the highest-grade nickel deposits on the planet.',
    commodity: 'Nickel',
    stage: 'Explorer',
    location: 'Western Australia',
    status: 'active',
    thesis: [
      'Nickel sulphide deposits are becoming increasingly rare, and new discoveries in proven belts command significant premiums.',
      'The Fraser Range belt hosts the Nova-Bollinger deposit (acquired for $1.8B) and Creasy Group discoveries.',
      'Initial electromagnetic (EM) surveys have identified multiple bedrock conductors consistent with massive sulphide mineralisation.',
      'The company secured $8M in funding in Jan 2026 to drill four priority targets, with assays expected mid-year.',
    ],
  },
]

export const PRIVATE_PLACEMENTS: PrivatePlacement[] = [
  {
    slug: 'copper-explorer-bc-pp',
    title: 'Pre-IPO Copper Explorer — British Columbia',
    date: 'Mar 30, 2026',
    teaser:
      'A private copper explorer is raising its final pre-listing round. The company controls a large land package in a proven BC copper belt, with a major drill program funded and a TSX-V listing expected in Q3 2026.',
    commodity: 'Copper',
    stage: 'Pre-IPO',
    jurisdiction: 'British Columbia',
    status: 'open',
    company: 'Summit Copper Inc.',
    minInvestment: '$25,000',
    thesis: [
      'The target is a 22,000-hectare property in the Highland Valley copper district — one of the most productive copper belts in North America.',
      'Historical drilling by a major mining company intersected significant copper mineralisation that was never followed up due to low copper prices in the early 2000s.',
      'The company has assembled a technical team with direct experience building and operating copper mines in BC.',
      'Funds from this placement will go towards a 7,000m Phase 1 drill program targeting extensions of the historical mineralisation.',
      'A TSX Venture listing is expected in Q3 2026, providing near-term liquidity. Early investors will receive warrants at a premium to the placement price.',
    ],
  },
  {
    slug: 'gold-royalty-africa',
    title: 'Gold Royalty Portfolio — West Africa',
    date: 'Mar 15, 2026',
    teaser:
      'A newly formed royalty company is offering a private placement to fund the acquisition of a portfolio of gold royalties across three producing mines in West Africa.',
    commodity: 'Gold',
    stage: 'Royalty Co.',
    jurisdiction: 'West Africa',
    status: 'open',
    company: 'Sahel Royalties Ltd.',
    minInvestment: '$50,000',
    thesis: [
      'The company is acquiring net smelter return (NSR) royalties on three producing gold mines in Burkina Faso and Mali.',
      'Combined annual revenue from the royalty portfolio is projected at $3.2M at $2,000 gold, growing with production ramp-ups and gold price appreciation.',
      'The founder previously built and sold a royalty company to a major streaming firm for $180M.',
      'Placement investors receive units consisting of one share and one half-warrant, with the warrants exercisable at a 50% premium over 24 months.',
    ],
  },
  {
    slug: 'lithium-brine-argentina',
    title: 'Lithium Brine Development — Argentina',
    date: 'Feb 20, 2026',
    teaser:
      'An advanced lithium developer is raising capital to complete its pilot plant and move into production. The project is located in a prolific lithium brine district in northern Argentina.',
    commodity: 'Lithium',
    stage: 'Development',
    jurisdiction: 'Argentina',
    status: 'closed',
    thesis: [
      'The project covers a 25,000-hectare salar in Salta Province with measured lithium concentrations above 600 mg/L.',
      'A Direct Lithium Extraction (DLE) pilot plant was commissioned in late 2025 with recovery rates exceeding 85%.',
      'The company has secured provincial permits and environmental approvals for a commercial-scale operation.',
    ],
  },
  {
    slug: 'critical-minerals-canada',
    title: 'Critical Minerals Platform — Northern Canada',
    date: 'Jan 15, 2026',
    teaser:
      'A newly formed vehicle is consolidating rare earth and critical mineral assets across northern Canada, targeting government co-funding under the Canadian Critical Minerals Strategy.',
    commodity: 'Rare Earths',
    stage: 'Consolidation',
    jurisdiction: 'Canada',
    status: 'open',
    minInvestment: '$100,000',
    thesis: [
      'Western governments are prioritising critical mineral supply chain security, with Canada earmarking $3.8B in incentives for domestic exploration and development.',
      'The company has secured options on three advanced-stage rare earth projects in the NWT and Nunavut.',
      'Government co-funding applications are in progress; if successful, up to 50% of exploration costs would be reimbursed.',
      'A strategic partnership with a Japanese trading house provides downstream offtake visibility and potential co-development capital.',
    ],
  },
]

export const TRADE_ALERTS: TradeAlert[] = [
  {
    id: 'ta-1',
    date: 'Apr 5, 2026',
    type: 'buy',
    title: 'Initiating position in NFC.V',
    detail: 'Adding Northern Fuel Corp. at $0.42. Uranium macro thesis intact; offtake news expected within weeks.',
  },
  {
    id: 'ta-2',
    date: 'Apr 2, 2026',
    type: 'trim',
    title: 'Trimming SGI.TO position by 20%',
    detail: 'Taking partial profits after 45% run. Still holding core position ahead of resource update.',
  },
  {
    id: 'ta-3',
    date: 'Mar 28, 2026',
    type: 'buy',
    title: 'New position: PCOP.V',
    detail: 'Initiating Pacific Copper Corp. at $0.18. Drill results due Q2 2026.',
  },
  {
    id: 'ta-4',
    date: 'Mar 20, 2026',
    type: 'hold',
    title: 'Holding SGI.TO through resource update',
    detail: 'Resource update imminent. Management confident in 30%+ increase to M&I.',
  },
  {
    id: 'ta-5',
    date: 'Mar 10, 2026',
    type: 'sell',
    title: 'Exiting SLH.V — full exit',
    detail: 'Silver-Lithium Hybrid reached our target. Locking in 120% gain.',
  },
]

export const PORTFOLIO: PortfolioPosition[] = [
  { id: 'p-1', name: 'Pacific Copper Corp.', ticker: 'PCOP.V', entryPrice: 0.18, currentPrice: 0.24, shares: 55000, gainPct: 33.3, status: 'active' },
  { id: 'p-2', name: 'Sierra Gold Inc.', ticker: 'SGI.TO', entryPrice: 4.10, currentPrice: 5.95, shares: 5000, gainPct: 45.1, status: 'active' },
  { id: 'p-3', name: 'Northern Fuel Corp.', ticker: 'NFC.V', entryPrice: 0.42, currentPrice: 0.39, shares: 25000, gainPct: -7.1, status: 'active' },
  { id: 'p-4', name: 'Silver-Lithium Hybrid', ticker: 'SLH.V', entryPrice: 0.31, currentPrice: 0.68, shares: 0, gainPct: 119.4, status: 'closed' },
  { id: 'p-5', name: 'NexGen Nickel Ltd.', ticker: 'NXN.AX', entryPrice: 0.55, currentPrice: 0.72, shares: 18000, gainPct: 30.9, status: 'active' },
]
