<script setup lang="ts">
import { industries, categories } from '~/data/site'
const route = useRoute()
const ind = industries.find(i => i.slug === route.params.slug)
if (!ind) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useHead({ title: ind.title })
const picks = categories.filter(c => ['trims', 'packaging', 'care-labels', 'rfid', 'paper-hangers', 'qr-and-nfc'].includes(c.slug))
const others = industries.filter(i => i.slug !== ind.slug)
</script>
<template>
  <div v-if="ind">
    <PageHero :title="ind.title" :lead="ind.text" eyebrow="Industries" :crumbs="[{ label: 'Industries', to: '/industries' }, { label: ind.title }]" :seed="ind.slug" :icon="ind.icon">
      <NuxtLink :to="`/contact?topic=General%20enquiry`" class="btn btn-dark" style="margin-top:12px">Talk to our {{ ind.title.toLowerCase() }} team</NuxtLink>
    </PageHero>
    <section class="section"><div class="container">
      <h2>Popular solutions for {{ ind.title.toLowerCase() }}</h2>
      <div class="grid g3" style="margin-top:24px"><NuxtLink v-for="c in picks" :key="c.slug" :to="`/solutions/${c.slug}`" class="card"><div class="icon">{{ c.icon }}</div><h3>{{ c.title }}</h3><p>{{ c.tagline }}</p></NuxtLink></div>
    </div></section>
    <section class="section alt"><div class="container">
      <h2>Other industries</h2>
      <div class="chips"><NuxtLink v-for="o in others" :key="o.slug" :to="`/industries/${o.slug}`" class="chip">{{ o.icon }} {{ o.title }}</NuxtLink></div>
    </div></section>
    <CtaBlock />
  </div>
</template>
<style scoped>
.chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
.chip { background: #fff; border: 1px solid var(--line); padding: 10px 16px; border-radius: 999px; font-weight: 500; }
.chip:hover { border-color: var(--brand-2); }
</style>
