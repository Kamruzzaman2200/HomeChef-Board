<script setup lang="ts">
import { searchSite } from '~/composables/searchIndex'
const open = useState('searchOpen', () => false)
const q = ref('')
const input = ref<HTMLInputElement>()
const active = ref(0)
const results = computed(() => searchSite(q.value, 8))
watch(open, async v => { if (v) { q.value = ''; await nextTick(); input.value?.focus() } })
watch(q, () => (active.value = 0))
function go(to: string) { open.value = false; navigateTo(to) }
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') { e.preventDefault(); active.value = Math.min(active.value + 1, results.value.length - 1) }
  if (e.key === 'ArrowUp') { e.preventDefault(); active.value = Math.max(active.value - 1, 0) }
  if (e.key === 'Enter') {
    e.preventDefault()
    const r = results.value[active.value]
    r ? go(r.to) : go(`/search?q=${encodeURIComponent(q.value)}`)
  }
  if (e.key === 'Escape') open.value = false
}
</script>
<template>
  <Transition name="fade">
    <div v-if="open" class="ov" @click.self="open = false">
      <div class="box" role="dialog" aria-modal="true" aria-label="Search">
        <input ref="input" v-model="q" type="search" placeholder="Search solutions, industries, news…" aria-label="Search" @keydown="onKey">
        <ul v-if="results.length" class="res">
          <li v-for="(r, i) in results" :key="r.to">
            <button :class="{ on: i === active }" @mouseenter="active = i" @click="go(r.to)">
              <span class="tag">{{ r.type }}</span> {{ r.title }}
            </button>
          </li>
        </ul>
        <p v-else-if="q" class="empty">No results for “{{ q }}”.</p>
        <p class="hint">↑↓ to navigate · Enter to open · Esc to close</p>
      </div>
    </div>
  </Transition>
</template>
<style scoped>
.ov { position: fixed; inset: 0; background: rgba(15, 42, 46, .45); z-index: 120; display: flex; justify-content: center; padding: 10vh 16px; }
.box { background: #fff; border-radius: var(--radius); width: 100%; max-width: 620px; box-shadow: var(--shadow); padding: 14px; align-self: flex-start; }
input { width: 100%; font: inherit; font-size: 1.1rem; padding: 14px 16px; border: 1.5px solid var(--line); border-radius: 10px; }
input:focus { outline: none; border-color: var(--brand-2); }
.res { list-style: none; margin: 10px 0 0; padding: 0; max-height: 50vh; overflow: auto; }
.res button { width: 100%; text-align: left; background: none; border: 0; padding: 10px 12px; border-radius: 8px; font: inherit; cursor: pointer; display: flex; gap: 10px; align-items: center; color: var(--ink); }
.res button.on { background: var(--bg-2); }
.empty, .hint { color: var(--ink-2); font-size: .85rem; padding: 10px 6px 0; margin: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
