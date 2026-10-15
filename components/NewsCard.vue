<script setup lang="ts">
import type { Article } from '~/data/site'
defineProps<{ a: Article }>()
const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
</script>
<template>
  <NuxtLink :to="`/news/${a.slug}`" class="card nc">
    <ArtPanel :seed="a.slug" ratio="16/10" />
    <div class="meta"><span class="tag">{{ a.category }}</span><time :datetime="a.date">{{ fmt(a.date) }}</time></div>
    <h3>{{ a.title }}</h3>
    <p>{{ a.summary }}</p>
    <span class="link-arrow">Read article</span>
  </NuxtLink>
</template>
<style scoped>
.nc { padding: 16px 16px 22px; }
.meta { display: flex; justify-content: space-between; align-items: center; margin: 16px 0 10px; font-size: .8rem; color: var(--ink-2); }
h3 { font-size: 1.15rem; }
</style>
