<script setup lang="ts">
// Generated placeholder artwork — swap for real photography via the `src` prop.
const props = defineProps<{ seed?: string; src?: string; alt?: string; ratio?: string; label?: string }>()
const palettes = [['#0f2a2e', '#1d4a4f', '#e9c46a'], ['#264653', '#2a9d8f', '#f4a261'], ['#3d405b', '#81b29a', '#f2cc8f'], ['#1b3a4b', '#e76f51', '#f4e1c1'], ['#283618', '#606c38', '#dda15e']]
const h = computed(() => [...(props.seed || 'x')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7))
const p = computed(() => palettes[h.value % palettes.length])
const shapes = computed(() => Array.from({ length: 5 }, (_, i) => {
  const v = (h.value >> (i * 3)) & 0xff
  return { cx: 10 + (v * 7) % 80, cy: 10 + (v * 13) % 80, r: 12 + (v % 26), c: p.value[(i % 2) + 1], o: .35 + (v % 40) / 100 }
}))
</script>
<template>
  <div class="art" :style="{ aspectRatio: ratio || '4/3' }">
    <img v-if="src" :src="src" :alt="alt || ''" loading="lazy">
    <svg v-else viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" role="img" :aria-label="alt || 'Illustration'">
      <rect width="100" height="100" :fill="p[0]" />
      <circle v-for="(s, i) in shapes" :key="i" :cx="s.cx" :cy="s.cy" :r="s.r" :fill="s.c" :opacity="s.o" />
      <path d="M0 78 Q25 66 50 76 T100 72 V100 H0Z" fill="#fff" opacity=".08" />
    </svg>
    <span v-if="label" class="lbl">{{ label }}</span>
  </div>
</template>
<style scoped>
.art { position: relative; border-radius: var(--radius); overflow: hidden; width: 100%; }
.art img, .art svg { width: 100%; height: 100%; object-fit: cover; }
.lbl { position: absolute; left: 16px; bottom: 14px; color: #fff; font-family: var(--serif); font-size: 2.2rem; text-shadow: 0 2px 12px rgba(0,0,0,.3); }
</style>
