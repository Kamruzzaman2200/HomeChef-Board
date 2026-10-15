<script setup lang="ts">
import { articles } from '~/data/site'
const route = useRoute()
const a = articles.find(x => x.slug === route.params.slug)
if (!a) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useHead({ title: a.title, meta: [{ name: 'description', content: a.summary }] })
const more = articles.filter(x => x.slug !== a.slug).slice(0, 3)
const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
const copied = ref(false)
async function share() {
  const url = window.location.href
  if (navigator.share) { try { await navigator.share({ title: a!.title, url }) } catch {} return }
  await navigator.clipboard.writeText(url); copied.value = true; setTimeout(() => (copied.value = false), 2000)
}
</script>
<template>
  <article v-if="a">
    <section class="section" style="padding-bottom:32px"><div class="container narrow">
      <nav class="breadcrumbs"><NuxtLink to="/">Home</NuxtLink><span>/</span><NuxtLink to="/resources/news">News</NuxtLink><span>/</span><span>{{ a.category }}</span></nav>
      <span class="tag">{{ a.category }}</span>
      <h1 style="margin-top:14px">{{ a.title }}</h1>
      <p class="muted"><time :datetime="a.date">{{ fmt(a.date) }}</time></p>
    </div></section>
    <div class="container narrow"><ArtPanel :seed="a.slug" ratio="16/8" /></div>
    <section class="section" style="padding-top:40px"><div class="container narrow body">
      <p class="lead">{{ a.summary }}</p>
      <p v-for="(p, i) in a.body" :key="i">{{ p }}</p>
      <div class="share"><button class="btn btn-ghost" @click="share">{{ copied ? '✓ Link copied' : 'Share article' }}</button><NuxtLink to="/resources/news" class="link-arrow">Back to all news</NuxtLink></div>
    </div></section>
    <section class="section alt"><div class="container"><h2>More news</h2><div class="grid g3" style="margin-top:24px"><NewsCard v-for="m in more" :key="m.slug" :a="m" /></div></div></section>
  </article>
</template>
<style scoped>
.narrow { max-width: 820px; }
.body p { font-size: 1.08rem; }
.share { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--line); }
</style>
