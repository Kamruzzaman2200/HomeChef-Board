import type { H3Event } from 'h3'
import nodemailer from 'nodemailer'

// ── simple in-memory rate limiter (per IP, per route) ──
const hits = new Map<string, number[]>()
export function rateLimit(event: H3Event, key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const k = `${key}:${ip}`
  const now = Date.now()
  const list = (hits.get(k) || []).filter(t => now - t < windowMs)
  if (list.length >= max) throw createError({ statusCode: 429, statusMessage: 'Too many requests', message: 'Too many submissions — please try again in a few minutes.' })
  list.push(now); hits.set(k, list)
}

export const clean = (v: unknown, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)

export function fail(errors: Record<string, string>) {
  throw createError({ statusCode: 422, statusMessage: 'Validation failed', message: 'Please fix the highlighted fields.', data: { errors } })
}

// ── persist every submission (works without SMTP) ──
export async function store(kind: string, payload: Record<string, unknown>) {
  const id = `${kind}:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  await useStorage('submissions').setItem(id, { ...payload, receivedAt: new Date().toISOString() })
  return id
}

// ── email notification (only if SMTP is configured) ──
export async function notify(subject: string, fields: Record<string, unknown>, opts: { replyTo?: string; attachments?: { filename: string; content: Buffer }[] } = {}) {
  const c = useRuntimeConfig()
  const text = Object.entries(fields).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v ?? ''}`).join('\n')
  if (!c.smtpHost) {
    console.info(`[forms] SMTP not configured — stored only.\n${subject}\n${text}`)
    return false
  }
  const transport = nodemailer.createTransport({
    host: c.smtpHost, port: Number(c.smtpPort) || 587, secure: Number(c.smtpPort) === 465,
    auth: c.smtpUser ? { user: c.smtpUser, pass: c.smtpPass } : undefined,
  })
  await transport.sendMail({ from: c.mailFrom, to: c.mailTo, replyTo: opts.replyTo, subject, text, attachments: opts.attachments })
  return true
}
