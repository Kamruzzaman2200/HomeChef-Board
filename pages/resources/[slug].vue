<script setup lang="ts">
import { resourcePages, articles, webinars, events, downloads, brandCases, testimonials } from '~/data/site'
const route = useRoute()
const slug = route.params.slug as string
const page = resourcePages[slug]
if (!page) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useHead({ title: page.title })
const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

// news filtering + pagination
const cats = ['All', ...new Set(articles.map(a => a.category))]
const active = ref((route.query.category as string) || 'All')
const perPage = 6
const shown = ref(perPage)
const list = computed(() => [...articles].sort((a, b) => b.date.localeCompare(a.date)).filter(a => active.value === 'All' || a.category === active.value))
watch(active, v => { shown.value = perPage; navigateTo({ query: v === 'All' ? {} : { category: v } }, { replace: true }) })
const isPast = (d: string) => new Date(d) < new Date()
const registered = ref<string[]>([])
const press = articles.filter(a => ['Company', 'Digital', 'Sustainability'].includes(a.category))
</script>
<template>
  <div v-if="page">
    <PageHero :title="page.title" :lead="page.lead" eyebrow="Resources" :crumbs="[{ label: 'Resources', to: '/resources/news' }, { label: page.title }]" :seed="slug" />
    <section class="section"><div class="container">

      <template v-if="slug === 'news'">
        <div class="pills" role="tablist">
          <button v-for="c in cats" :key="c" role="tab" :aria-selected="active === c" :class="{ on: active === c }" @click="active = c">{{ c }}</button>
        </div>
        <div class="grid g3" style="margin-top:28px"><NewsCard v-for="a in list.slice(0, shown)" :key="a.slug" :a="a" /></div>
        <p v-if="!list.length" class="muted">No articles in this category yet.</p>
        <div v-if="shown < list.length" style="text-align:center;margin-top:32px"><button class="btn btn-dark" @click="shown += perPage">Load more</button></div>
      </template>

      <template v-else-if="slug === 'webinars'">
        <div class="grid g3">
          <div v-for="w in webinars" :key="w.title" class="card">
            <ArtPanel :seed="w.title" ratio="16/9" />
            <span class="tag" style="margin:16px 0 8px;align-self:flex-start">{{ isPast(w.date) ? 'On demand' : 'Upcoming' }}</span>
            <h3>{{ w.title }}</h3><p>{{ fmt(w.date) }} · {{ w.length }}</p>
            <button class="btn btn-dark" :disabled="registered.includes(w.title)" @click="registered.push(w.title)">
              {{ registered.includes(w.title) ? '✓ Registered — check your inbox' : isPast(w.date) ? 'Watch recording' : 'Register' }}
            </button>
          </div>
        </div>
        <p class="muted" style="margin-top:20px;font-size:.85rem">Connect the Register buttons to your webinar platform (Zoom, Livestorm, etc.) in <code>pages/resources/[slug].vue</code>.</p>
      </template>

      <template v-else-if="slug === 'events'">
        <div class="ev" v-for="e in events" :key="e.title">
          <div class="date"><strong>{{ new Date(e.date).getDate() }}</strong><span>{{ new Date(e.date).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) }}</span></div>
          <div style="flex:1"><h3>{{ e.title }}</h3><p class="muted" style="margin:0">{{ e.place }} · {{ e.booth }}</p></div>
          <NuxtLink :to="`/contact?topic=General%20enquiry`" class="btn btn-ghost">Book a meeting</NuxtLink>
        </div>
      </template>

      <template v-else-if="slug === 'brand-cases'">
        <div class="grid g3"><div v-for="b in brandCases" :key="b.brand" class="card"><ArtPanel :seed="b.brand" ratio="16/10" /><span class="eyebrow" style="margin-top:16px">{{ b.brand }}</span><h3>{{ b.result }}</h3><p>{{ b.text }}</p></div></div>
      </template>

      <template v-else-if="slug === 'downloads'">
        <div class="dl" v-for="d in downloads" :key="d.title">
          <span style="font-size:1.6rem">📄</span><div style="flex:1"><strong>{{ d.title }}</strong><div class="muted" style="font-size:.85rem">{{ d.size }}</div></div>
          <a :href="d.file" download class="btn btn-dark">Download</a>
        </div>
      </template>

      <template v-else-if="slug === 'testimonials'">
        <div class="grid g3"><figure v-for="t in testimonials" :key="t.company" class="card" style="margin:0"><blockquote style="margin:0 0 16px;font-size:1.05rem">“{{ t.quote }}”</blockquote><figcaption><strong>{{ t.name }}</strong><br><span class="muted">{{ t.company }}</span></figcaption></figure></div>
      </template>

      <template v-else-if="slug === 'pressroom'">
        <div class="split" style="align-items:start">
          <div><h2>Press releases</h2><div class="grid" style="margin-top:20px"><NewsCard v-for="a in press" :key="a.slug" :a="a" /></div></div>
          <div class="card"><h3>Media contact</h3><p>For interviews, images and statements, contact our communications team.</p><NuxtLink to="/contact?topic=Press" class="btn btn-dark">Contact press team</NuxtLink><a href="/downloads/northloom-brochure.txt" download class="link-arrow" style="margin-top:16px">Download media kit</a></div>
        </div>
      </template>

      <template v-else-if="slug === 'newsletter'">
        <div style="max-width:560px"><NewsletterForm /></div>
      </template>

    </div></section>
    <CtaBlock v-if="slug !== 'newsletter'" />
  </div>
</template>
<style scoped>
.pills { display: inline-flex; flex-wrap: wrap; gap: 6px; background: var(--bg-2); padding: 5px; border-radius: 999px; }
.pills button { border: 0; background: none; padding: 8px 16px; border-radius: 999px; font: inherit; font-weight: 600; font-size: .88rem; cursor: pointer; color: var(--ink-2); }
.pills button.on { background: #fff; color: var(--brand); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.ev, .dl { display: flex; align-items: center; gap: 24px; padding: 22px 0; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
.ev h3 { margin: 0 0 4px; }
.date { background: var(--brand); color: #fff; border-radius: 12px; padding: 10px 16px; text-align: center; min-width: 88px; }
.date strong { display: block; font-family: var(--serif); font-size: 1.8rem; line-height: 1; }
.date span { font-size: .78rem; }
</style>
