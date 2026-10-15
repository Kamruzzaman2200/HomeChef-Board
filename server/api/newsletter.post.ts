export default defineEventHandler(async (event) => {
  rateLimit(event, 'newsletter', 8)
  const b = await readBody(event) || {}
  if (b.website) return { ok: true, message: 'Subscribed!' }
  const email = clean(b.email, 200).toLowerCase()
  if (!isEmail(email)) fail({ email: 'Enter a valid email address' })
  const storage = useStorage('submissions')
  const key = `newsletter:${email.replace(/[^a-z0-9]/g, '_')}`
  if (await storage.hasItem(key)) return { ok: true, message: 'You’re already subscribed — thanks for being with us!' }
  const interests = Array.isArray(b.interests) ? b.interests.map((i: unknown) => clean(i, 40)).slice(0, 10) : []
  await storage.setItem(key, { email, name: clean(b.name, 80), interests, subscribedAt: new Date().toISOString() })
  try { await notify('[Website] New newsletter subscriber', { email, interests }) } catch (e) { console.error(e) }
  return { ok: true, message: 'You’re subscribed. Look out for our next issue.' }
})
