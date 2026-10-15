<script setup lang="ts">
import { nav } from '~/data/site'
const open = defineModel<boolean>({ default: false })
defineProps<{ portals: { label: string; href: string }[] }>()
const expanded = ref<string | null>(null)
</script>
<template>
  <Transition name="slide">
    <div v-if="open" class="mnav" role="dialog" aria-modal="true" aria-label="Menu">
      <div class="top">
        <strong>Menu</strong>
        <button class="x" aria-label="Close menu" @click="open = false">×</button>
      </div>
      <div v-for="item in nav" :key="item.label" class="grp">
        <button class="grp-btn" :aria-expanded="expanded === item.label" @click="expanded = expanded === item.label ? null : item.label">
          {{ item.label }} <span>{{ expanded === item.label ? '−' : '+' }}</span>
        </button>
        <div v-if="expanded === item.label" class="grp-body">
          <template v-for="col in item.columns" :key="col.title">
            <NuxtLink :to="col.to" class="ct">{{ col.title }}</NuxtLink>
            <NuxtLink v-for="l in col.links" :key="l.to" :to="l.to" class="sub">{{ l.label }}</NuxtLink>
          </template>
        </div>
      </div>
      <div class="grp portals">
        <span class="eyebrow">B2B Login</span>
        <a v-for="p in portals" :key="p.label" :href="p.href" target="_blank" rel="noopener">{{ p.label }} ↗</a>
      </div>
      <NuxtLink to="/contact" class="btn btn-primary" style="margin-top:20px">Contact us</NuxtLink>
    </div>
  </Transition>
</template>
<style scoped>
.mnav { position: fixed; inset: 0; background: var(--bg); z-index: 100; overflow-y: auto; padding: 16px 20px 40px; }
.top { display: flex; justify-content: space-between; align-items: center; height: 48px; margin-bottom: 8px; }
.x { font-size: 2rem; background: none; border: 0; cursor: pointer; line-height: 1; color: var(--ink); }
.grp { border-bottom: 1px solid var(--line); }
.grp-btn { width: 100%; display: flex; justify-content: space-between; background: none; border: 0; font: inherit; font-weight: 600; font-size: 1.05rem; padding: 16px 0; cursor: pointer; color: var(--ink); }
.grp-body { padding-bottom: 14px; display: flex; flex-direction: column; }
.ct { font-weight: 600; color: var(--brand); padding: 8px 0 4px; }
.sub { padding: 5px 0 5px 12px; color: var(--ink-2); font-size: .95rem; }
.portals { padding: 18px 0; display: flex; flex-direction: column; gap: 8px; }
.slide-enter-active, .slide-leave-active { transition: transform .25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
