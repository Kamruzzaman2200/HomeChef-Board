<script setup lang="ts">
const choice = useState<string | null>('cookieChoice', () => null)
const ready = ref(false)
const cookie = useCookie<string | null>('nl_cookie_consent', { maxAge: 60 * 60 * 24 * 180, sameSite: 'lax' })
onMounted(() => { choice.value = cookie.value ?? null; ready.value = true })
function set(v: 'all' | 'necessary') { cookie.value = v; choice.value = v }
</script>
<template>
  <Transition name="up">
    <div v-if="ready && !choice" class="cb" role="dialog" aria-label="Cookie consent">
      <p>We use necessary cookies to run this site and, with your permission, analytics cookies to improve it. <NuxtLink to="/legal/cookies">Read more</NuxtLink></p>
      <div class="b">
        <button class="btn btn-ghost" @click="set('necessary')">Necessary only</button>
        <button class="btn btn-primary" @click="set('all')">Accept all</button>
      </div>
    </div>
  </Transition>
</template>
<style scoped>
.cb { position: fixed; left: 16px; right: 16px; bottom: 16px; max-width: 560px; background: #fff; border: 1px solid var(--line); border-radius: var(--radius); box-shadow: var(--shadow); padding: 20px; z-index: 90; }
.cb p { font-size: .9rem; margin-bottom: 14px; }
.cb a { text-decoration: underline; }
.b { display: flex; gap: 10px; flex-wrap: wrap; }
.up-enter-active, .up-leave-active { transition: transform .25s, opacity .25s; }
.up-enter-from, .up-leave-to { transform: translateY(20px); opacity: 0; }
</style>
