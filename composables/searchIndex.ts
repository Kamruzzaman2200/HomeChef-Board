import { categories, industries, aboutPages, articles, resourcePages, jobs, legalPages } from '~/data/site'

export interface SearchEntry { title: string; to: string; text: string; type: string }

export function buildSearchIndex(): SearchEntry[] {
  const out: SearchEntry[] = []
  for (const c of categories) {
    out.push({ title: c.title, to: `/solutions/${c.slug}`, text: `${c.tagline} ${c.intro}`, type: 'Solution' })
    for (const i of c.items) out.push({ title: i.title, to: `/solutions/${c.slug}/${i.slug}`, text: `${c.title} ${i.summary}`, type: 'Solution' })
  }
  for (const i of industries) out.push({ title: i.title, to: `/industries/${i.slug}`, text: i.text, type: 'Industry' })
  for (const p of aboutPages) out.push({ title: p.title, to: `/about/${p.slug}`, text: `${p.lead} ${p.body.join(' ')}`, type: 'About' })
  for (const a of articles) out.push({ title: a.title, to: `/news/${a.slug}`, text: `${a.summary} ${a.body.join(' ')}`, type: 'News' })
  for (const [k, v] of Object.entries(resourcePages)) out.push({ title: v.title, to: `/resources/${k}`, text: v.lead, type: 'Resource' })
  for (const j of jobs) out.push({ title: j.title, to: `/careers/${j.id}`, text: `${j.team} ${j.location} ${j.type}`, type: 'Career' })
  for (const [k, v] of Object.entries(legalPages)) out.push({ title: v.title, to: `/legal/${k}`, text: v.body.join(' '), type: 'Legal' })
  out.push({ title: 'Contact our team', to: '/contact', text: 'contact sales quote sample enquiry', type: 'Contact' })
  out.push({ title: 'Data Integration', to: '/data-integration', text: 'PLM ERP API EDI artwork variable data', type: 'Solution' })
  return out
}

export function searchSite(q: string, limit = 20): SearchEntry[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return buildSearchIndex()
    .map(e => {
      const t = e.title.toLowerCase(), b = e.text.toLowerCase()
      let score = 0
      for (const term of terms) {
        if (t.includes(term)) score += 5
        if (b.includes(term)) score += 1
        if (!t.includes(term) && !b.includes(term)) return null
      }
      return { e, score }
    })
    .filter((x): x is { e: SearchEntry; score: number } => !!x)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(x => x.e)
}
