<script setup lang="ts">
import { useForm, isEmail, required } from '~/composables/useForm'
const props = defineProps<{ jobId: string; jobTitle: string }>()
const fileName = ref('')
const fileData = ref('')
const fileErr = ref('')
const { data, errors, status, message, submit } = useForm(
  { name: '', email: '', phone: '', linkedin: '', cover: '', consent: false, website: '' },
  {
    name: required('Name'), email: v => (isEmail(v) ? null : 'Enter a valid email address'),
    cover: v => (v && v.trim().length >= 30 ? null : 'Please write at least a few sentences'),
    consent: v => (v ? null : 'Please accept the privacy policy'),
  },
  '/api/apply',
)
function onFile(e: Event) {
  const f = (e.target as HTMLInputElement).files?.[0]
  fileErr.value = ''; fileName.value = ''; fileData.value = ''
  if (!f) return
  if (f.size > 3 * 1024 * 1024) { fileErr.value = 'CV must be under 3 MB'; return }
  if (!/\.(pdf|docx?)$/i.test(f.name)) { fileErr.value = 'Upload a PDF or Word file'; return }
  const r = new FileReader()
  r.onload = () => { fileData.value = String(r.result); fileName.value = f.name }
  r.readAsDataURL(f)
}
async function send() {
  if (!fileData.value) { fileErr.value = 'Please attach your CV'; return }
  const ok = await submit({ jobId: props.jobId, jobTitle: props.jobTitle, cvName: fileName.value, cv: fileData.value })
  if (ok) { fileName.value = ''; fileData.value = '' }
}
</script>
<template>
  <form class="form" novalidate @submit.prevent="send">
    <div class="row">
      <div class="field" :class="{ invalid: errors.name }"><label for="a-n">Full name *</label><input id="a-n" v-model="data.name"><div v-if="errors.name" class="err">{{ errors.name }}</div></div>
      <div class="field" :class="{ invalid: errors.email }"><label for="a-e">Email *</label><input id="a-e" v-model="data.email" type="email"><div v-if="errors.email" class="err">{{ errors.email }}</div></div>
    </div>
    <div class="row">
      <div class="field"><label for="a-p">Phone</label><input id="a-p" v-model="data.phone" type="tel"></div>
      <div class="field"><label for="a-l">LinkedIn / portfolio URL</label><input id="a-l" v-model="data.linkedin" type="url"></div>
    </div>
    <div class="field" :class="{ invalid: fileErr }">
      <label for="a-cv">CV (PDF or Word, max 3 MB) *</label><input id="a-cv" type="file" accept=".pdf,.doc,.docx" @change="onFile">
      <div v-if="fileErr" class="err">{{ fileErr }}</div>
    </div>
    <div class="field" :class="{ invalid: errors.cover }"><label for="a-c">Why this role? *</label><textarea id="a-c" v-model="data.cover" rows="5" /><div v-if="errors.cover" class="err">{{ errors.cover }}</div></div>
    <input v-model="data.website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div class="field" :class="{ invalid: errors.consent }">
      <label class="check"><input v-model="data.consent" type="checkbox"> <span>I agree that my data is stored for this application. *</span></label>
      <div v-if="errors.consent" class="err">{{ errors.consent }}</div>
    </div>
    <div v-if="message" class="notice" :class="status === 'ok' ? 'ok' : 'bad'" role="status">{{ message }}</div>
    <div><button class="btn btn-dark" :disabled="status === 'sending'" type="submit">{{ status === 'sending' ? 'Sending…' : 'Submit application' }}</button></div>
  </form>
</template>
