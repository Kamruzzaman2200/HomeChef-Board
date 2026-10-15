import { jobs } from '~/data/site'
export default defineEventHandler(async (event) => {
  rateLimit(event, 'apply', 3)
  const b = await readBody(event) || {}
  if (b.website) return { ok: true, message: 'Thanks!' }
  const job = jobs.find(j => j.id === b.jobId)
  const d = { name: clean(b.name, 120), email: clean(b.email, 200), phone: clean(b.phone, 40), linkedin: clean(b.linkedin, 300), cover: clean(b.cover, 6000) }
  const errors: Record<string, string> = {}
  if (!job) errors.jobId = 'Unknown position'
  if (!d.name) errors.name = 'Name is required'
  if (!isEmail(d.email)) errors.email = 'Enter a valid email address'
  if (d.cover.length < 30) errors.cover = 'Please write at least a few sentences'
  if (!b.consent) errors.consent = 'Please accept the privacy policy'
  const m = typeof b.cv === 'string' ? b.cv.match(/^data:([\w/.+-]+);base64,(.+)$/) : null
  if (!m) errors.cv = 'Please attach your CV'
  const buf = m ? Buffer.from(m[2], 'base64') : null
  if (buf && buf.length > 3 * 1024 * 1024) errors.cv = 'CV must be under 3 MB'
  if (Object.keys(errors).length) fail(errors)

  const cvName = clean(b.cvName, 120).replace(/[^\w.\- ]/g, '_') || 'cv.pdf'
  await store('application', { ...d, job: job!.title, cvName, cvBase64: m![2] })
  try { await notify(`[Careers] ${job!.title} — ${d.name}`, { ...d, job: job!.title }, { replyTo: d.email, attachments: [{ filename: cvName, content: buf! }] }) }
  catch (e) { console.error('[apply] email failed', e) }
  return { ok: true, message: 'Application received! Our recruiting team will be in touch within two weeks.' }
})
