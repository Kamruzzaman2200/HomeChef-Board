// Small form helper: client-side validation + POST to a server route.
type Rules<T> = Partial<Record<keyof T, (v: any, all: T) => string | null>>

export function useForm<T extends Record<string, any>>(initial: T, rules: Rules<T>, endpoint: string) {
  const data = reactive({ ...initial }) as T
  const errors = reactive({} as Record<keyof T, string | null>)
  const status = ref<'idle' | 'sending' | 'ok' | 'error'>('idle')
  const message = ref('')

  function validate() {
    let ok = true
    for (const k in rules) {
      const e = rules[k]!(data[k], data)
      ;(errors as any)[k] = e
      if (e) ok = false
    }
    return ok
  }

  async function submit(extra: Record<string, any> = {}) {
    message.value = ''
    if (!validate()) { status.value = 'error'; message.value = 'Please fix the highlighted fields.'; return false }
    status.value = 'sending'
    try {
      const res = await $fetch<{ ok: boolean; message: string }>(endpoint, { method: 'POST', body: { ...data, ...extra } })
      status.value = 'ok'; message.value = res.message
      Object.assign(data, initial)
      return true
    } catch (err: any) {
      status.value = 'error'
      const srv = err?.data?.data?.errors as Record<string, string> | undefined
      if (srv) for (const k in srv) (errors as any)[k] = srv[k]
      message.value = err?.data?.message || err?.data?.statusMessage || 'Something went wrong. Please try again.'
      return false
    }
  }
  return { data, errors, status, message, submit, validate }
}

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || '')
export const required = (label: string) => (v: any) => (v && String(v).trim() ? null : `${label} is required`)
