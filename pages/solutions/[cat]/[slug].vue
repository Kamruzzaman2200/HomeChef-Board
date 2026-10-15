<script setup lang="ts">
import { findCategory } from '~/data/site'
const route = useRoute()
const cat = findCategory(route.params.cat as string)
const item = cat?.items.find(i => i.slug === route.params.slug)
if (!cat || !item) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useHead({ title: `${item.title} · ${cat.title}`, meta: [{ name: 'description', content: item.summary }] })
const benefits = [
  { t: 'Designed with you', d: 'Our studio adapts every detail to your brand guidelines and product.' },
  { t: 'Better materials', d: 'Recycled and certified options are our default.' },
  { t: 'Made near your factories', d: 'Short lead times from our regional production hubs.' },
  { t: 'Data-connected', d: 'Artwork and variable data flow from your systems — no retyping.' },
]
const faqs = [
  { q: 'What is the minimum order quantity?', a: 'It depends on construction and finish. Most items start from a few thousand units; ask us for a quote.' },
  { q: 'How long does sampling take?', a: 'Typically 5–10 working days after artwork approval.' },
  { q: 'Can you match our existing supplier’s spec?', a: 'Yes. Send us a physical sample or a spec sheet and we will match or improve it.' },
]
const open = ref<number | null>(0)
const siblings = cat.items.filter(i => i.slug !== item.slug)
</script>
<template>
  <div v-if="cat && item">
    <PageHero :title="item.title" :lead="item.summary" :eyebrow="cat.title" :crumbs="[{ label: 'Solutions', to: '/solutions' }, { label: cat.title, to: `/solutions/${cat.slug}` }, { label: item.title }]" :seed="item.slug">
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">
        <NuxtLink :to="`/contact?topic=Request%20a%20quote`" class="btn btn-dark">Get a quote</NuxtLink>
        <NuxtLink to="/contact?topic=Request%20samples" class="btn btn-ghost">Order samples</NuxtLink>
      </div>
    </PageHero>
    <section class="section">
      <div class="container">
        <h2>Why choose our {{ item.title.toLowerCase() }}</h2>
        <div class="grid g4" style="margin-top:24px"><div v-for="b in benefits" :key="b.t" class="card"><h3>{{ b.t }}</h3><p>{{ b.d }}</p></div></div>
      </div>
    </section>
    <section class="section alt">
      <div class="container" style="max-width:820px">
        <h2>Frequently asked questions</h2>
        <div v-for="(f, i) in faqs" :key="f.q" class="faq">
          <button :aria-expanded="open === i" @click="open = open === i ? null : i">{{ f.q }} <span>{{ open === i ? '−' : '+' }}</span></button>
          <p v-show="open === i">{{ f.a }}</p>
        </div>
      </div>
    </section>
    <section v-if="siblings.length" class="section">
      <div class="container">
        <h2>More in {{ cat.title }}</h2>
        <div class="grid g4" style="margin-top:24px"><NuxtLink v-for="s in siblings" :key="s.slug" :to="`/solutions/${cat.slug}/${s.slug}`" class="card"><h3>{{ s.title }}</h3><p>{{ s.summary }}</p><span class="link-arrow">View</span></NuxtLink></div>
      </div>
    </section>
    <CtaBlock />
  </div>
</template>
<style scoped>
.faq { border-bottom: 1px solid var(--line); }
.faq button { width: 100%; display: flex; justify-content: space-between; gap: 16px; text-align: left; background: none; border: 0; padding: 18px 0; font: inherit; font-weight: 600; font-size: 1.02rem; cursor: pointer; color: var(--ink); }
.faq p { color: var(--ink-2); padding-bottom: 18px; margin: 0; }
</style>
