<script setup lang="ts">
import { aboutPages, locations, stats } from '~/data/site'
const route = useRoute()
const slug = route.params.slug as string
const page = aboutPages.find(p => p.slug === slug)
if (!page) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useHead({ title: page.title })
const region = ref('All')
const regions = ['All', ...new Set(locations.map(l => l.country))]
const filtered = computed(() => locations.filter(l => region.value === 'All' || l.country === region.value))
</script>
<template>
  <div v-if="page">
    <PageHero :title="page.title" :lead="page.lead" eyebrow="About Northloom" :crumbs="[{ label: 'About', to: '/about/about-us' }, { label: page.title }]" :seed="slug" />
    <section class="section"><div class="container split" style="align-items:start">
      <div><p v-for="(p, i) in page.body" :key="i" class="lead" style="max-width:none">{{ p }}</p></div>
      <nav class="card side" aria-label="About pages">
        <strong style="margin-bottom:8px">About</strong>
        <NuxtLink v-for="p in aboutPages" :key="p.slug" :to="`/about/${p.slug}`" :class="{ on: p.slug === slug }">{{ p.title }}</NuxtLink>
      </nav>
    </div></section>

    <section v-if="slug === 'locations'" class="section alt"><div class="container">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px">
        <h2 style="margin:0">Our sites</h2>
        <div class="field" style="min-width:220px"><label for="reg" class="sr-only">Filter by country</label><select id="reg" v-model="region"><option v-for="r in regions" :key="r">{{ r }}</option></select></div>
      </div>
      <div class="grid g4" style="margin-top:24px">
        <div v-for="l in filtered" :key="l.city" class="card"><h3>{{ l.city }}</h3><p>{{ l.country }}</p><span class="tag" style="align-self:flex-start">{{ l.type }}</span></div>
      </div>
    </div></section>

    <section v-if="slug === 'about-us'" class="section dark"><div class="container">
      <div class="stats"><StatCounter v-for="s in stats" :key="s.label" v-bind="s" /></div>
    </div></section>
    <CtaBlock />
  </div>
</template>
<style scoped>
.side { gap: 4px; }
.side a { padding: 8px 12px; border-radius: 8px; color: var(--ink-2); }
.side a.on, .side a:hover { background: var(--bg-2); color: var(--brand); font-weight: 600; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 32px; text-align: center; }
</style>
