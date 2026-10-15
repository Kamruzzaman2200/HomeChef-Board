<script setup lang="ts">
import { useForm, isEmail } from '~/composables/useForm'
const props = defineProps<{ compact?: boolean }>()
const interests = ['Trims', 'Packaging', 'Digital & RFID', 'Sustainability', 'Regulation']
const { data, errors, status, message, submit } = useForm(
  { email: '', name: '', interests: [] as string[], website: '' },
  { email: v => (isEmail(v) ? null : 'Enter a valid email address') },
  '/api/newsletter',
)
</script>
<template>
  <form class="form nl" :class="{ compact: props.compact }" novalidate @submit.prevent="submit()">
    <div v-if="!compact" class="field"><label for="n-name">First name</label><input id="n-name" v-model="data.name" autocomplete="given-name"></div>
    <div class="field" :class="{ invalid: errors.email }">
      <label :for="compact ? 'n-email-f' : 'n-email'" :class="{ 'sr-only': compact }">Email *</label>
      <div class="inline">
        <input :id="compact ? 'n-email-f' : 'n-email'" v-model="data.email" type="email" placeholder="you@company.com" autocomplete="email">
        <button v-if="compact" class="btn btn-primary" :disabled="status === 'sending'" type="submit">{{ status === 'sending' ? '…' : 'Join' }}</button>
      </div>
      <div v-if="errors.email" class="err">{{ errors.email }}</div>
    </div>
    <fieldset v-if="!compact" class="ints">
      <legend>I’m interested in</legend>
      <label v-for="i in interests" :key="i" class="check"><input v-model="data.interests" type="checkbox" :value="i"> {{ i }}</label>
    </fieldset>
    <input v-model="data.website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
    <div v-if="message" class="notice" :class="status === 'ok' ? 'ok' : 'bad'" role="status">{{ message }}</div>
    <div v-if="!compact"><button class="btn btn-dark" :disabled="status === 'sending'" type="submit">{{ status === 'sending' ? 'Subscribing…' : 'Subscribe' }}</button></div>
  </form>
</template>
<style scoped>
.inline { display: flex; gap: 8px; }
.compact .notice { font-size: .82rem; padding: 8px 12px; }
.compact .btn { padding: .7em 1.1em; }
.ints { border: 0; padding: 0; margin: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 8px; }
.ints legend { font-weight: 600; font-size: .85rem; margin-bottom: 8px; }
</style>
