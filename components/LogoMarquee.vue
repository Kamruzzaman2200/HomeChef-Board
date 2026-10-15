<script setup lang="ts">
import { clientLogos } from '~/data/site'
</script>
<template>
  <div class="mq" aria-label="Sample clients">
    <div class="track">
      <span v-for="(l, i) in [...clientLogos, ...clientLogos]" :key="i" :aria-hidden="i >= clientLogos.length">{{ l }}</span>
    </div>
  </div>
</template>
<style scoped>
.mq { overflow: hidden; mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent); }
.track { display: flex; gap: 64px; width: max-content; animation: scroll 32s linear infinite; }
.mq:hover .track { animation-play-state: paused; }
span { font-family: var(--serif); font-size: 1.5rem; font-weight: 600; color: #8a9796; white-space: nowrap; letter-spacing: .02em; }
@keyframes scroll { to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { .track { animation: none; flex-wrap: wrap; width: auto; } }
</style>
