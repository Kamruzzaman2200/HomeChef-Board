export default defineEventHandler(async (event) => {
  rateLimit(event, 'contact')
  const b = await readBody(event) || {}
  if (b.website) return { ok: true, message: 'Thanks!' } // honeypot
  const d = {
    name: clean(b.name, 120), email: clean(b.email, 200), company: clean(b.company, 160), phone: clean(b.phone, 40),
    country: clean(b.country, 80), topic: clean(b.topic, 80) || 'General enquiry', message: clean(b.message, 5000), page: clean(b.page, 300),
  }
  const errors: Record<string, string> = {}
  if (!d.name) errors.name = 'Name is required'
  if (!isEmail(d.email)) errors.email = 'Enter a valid email address'
  if (!d.company) errors.company = 'Company is required'
  if (d.message.length < 10) errors.message = 'Tell us a bit more (at least 10 characters)'
  if (!b.consent) errors.consent = 'Please accept the privacy policy'
  if (Object.keys(errors).length) fail(errors)

  await store('contact', d)
  try { await notify(`[Website] ${d.topic} — ${d.company}`, d, { replyTo: d.email }) }
  catch (e) { console.error('[contact] email failed', e) }
  return { ok: true, message: `Thanks ${d.name.split(' ')[0]} — your message is with our team. We’ll reply within one business day.` }
})
