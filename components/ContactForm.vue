<script setup lang="ts">
import { useForm, isEmail, required } from '~/composables/useForm'
import { categories } from '~/data/site'
const route = useRoute()
const topics = ['General enquiry', 'Request a quote', 'Request samples', ...categories.map(c => c.title), 'Ethics report', 'Press']
const { data, errors, status, message, submit } = useForm(
  { name: '', email: '', company: '', phone: '', country: '', topic: (route.query.topic as string) || 'General enquiry', message: '', consent: false, website: '' },
  {
    name: required('Name'),
    email: v => (isEmail(v) ? null : 'Enter a valid email address'),
    company: required('Company'),
    message: v => (v && v.trim().length >= 10 ? null : 'Tell us a bit more (at least 10 characters)'),
    consent: v => (v ? null : 'Please accept the privacy policy'),
  },
  '/api/contact',
)
</script>
<template>
  <form class="form" novalidate @submit.prevent="submit({ page: route.fullPath })">
    <div class="row">
      <div class="field" :class="{ invalid: errors.name }"><label for="c-name">Full name *</label><input id="c-name" v-model="data.name" autocomplete="name"><div v-if="errors.name" class="err">{{ errors.name }}</div></div>
      <div class="field" :class="{ invalid: errors.email }"><label for="c-email">Work email *</label><input id="c-email" v-model="data.email" type="email" autocomplete="email"><div v-if="errors.email" class="err">{{ errors.email }}</div></div>
    </div>
    <div class="row">
      <div class="field" :class="{ invalid: errors.company }"><label for="c-co">Company *</label><input id="c-co" v-model="data.company" autocomplete="organization"><div v-if="errors.company" class="err">{{ errors.company }}</div></div>
      <div class="field"><label for="c-ph">Phone</label><input id="c-ph" v-model="data.phone" type="tel" autocomplete="tel"></div>
    </div>
    <div class="row">
      <div class="field"><label for="c-ct">Country</label><input id="c-ct" v-model="data.country" autocomplete="country-name"></div>
      <div class="field"><label for="c-tp">Topic</label><select id="c-tp" v-model="data.topic"><option v-for="t in topics" :key="t">{{ t }}</option></select></div>
    </div>
    <div class="field" :class="{ invalid: errors.message }"><label for="c-msg">How can we help? *</label><textarea id="c-msg" v-model="data.message" rows="5" /><div v-if="errors.message" class="err">{{ errors.message }}</div></div>
    <input v-model="data.website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true" placeholder="Leave empty">
    <div class="field" :class="{ invalid: errors.consent }">
      <label class="check"><input v-model="data.consent" type="checkbox"> <span>I agree to the <NuxtLink to="/legal/privacy-policy" target="_blank" style="text-decoration:underline">privacy policy</NuxtLink>. *</span></label>
      <div v-if="errors.consent" class="err">{{ errors.consent }}</div>
    </div>
    <div v-if="message" class="notice" :class="status === 'ok' ? 'ok' : 'bad'" role="status">{{ message }}</div>
    <div><button class="btn btn-dark" type="submit" :disabled="status === 'sending'">{{ status === 'sending' ? 'Sending…' : 'Send message' }}</button></div>
  </form>
</template>
