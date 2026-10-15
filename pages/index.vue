<script setup lang="ts">
import { pillars, reasons, stats, categories, testimonials, articles } from '~/data/site'
useHead({ title: 'Branded trims, packaging & product identity', titleTemplate: 'Northloom Group — %s' })
const filter = ref<'all' | 'physical' | 'digital'>('all')
const tiles = computed(() => categories.filter(c => filter.value === 'all' || c.group === filter.value))
const latest = [...articles].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4)
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg" aria-hidden="true"><span v-for="n in 6" :key="n" :style="{ '--i': n }" /></div>
      <div class="container hero-in">
        <span class="eyebrow">Trims · Packaging · Product identity</span>
        <h1>Every product tells your story. <em>We help you write it.</em></h1>
        <p class="lead">Labels, tags, packaging and the data behind them — designed, produced and connected by one partner, close to where you make.</p>
        <div class="hero-cta">
          <NuxtLink to="/solutions" class="btn btn-primary">Explore solutions</NuxtLink>
          <NuxtLink to="/contact?topic=Request%20samples" class="btn btn-ghost">Request samples</NuxtLink>
        </div>
      </div>
    </section>

    <!-- PILLARS -->
    <section class="section">
      <div class="container">
        <div class="grid g4">
          <NuxtLink v-for="p in pillars" :key="p.title" :to="p.to" class="card">
            <div class="icon">{{ p.icon }}</div><h3>{{ p.title }}</h3><p>{{ p.text }}</p><span class="link-arrow">Read more</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- LOGOS -->
    <section class="logos">
      <div class="container"><p class="eyebrow" style="text-align:center">Trusted by brands like (sample names)</p></div>
      <LogoMarquee />
      <div class="container" style="text-align:center;margin-top:20px"><NuxtLink to="/resources/testimonials" class="link-arrow">Read what customers say</NuxtLink></div>
    </section>

    <!-- WHY -->
    <section class="section alt">
      <div class="container split">
        <ArtPanel seed="why-northloom" ratio="1/1" />
        <div>
          <span class="eyebrow">Why Northloom</span>
          <h2>One partner from first sketch to final scan</h2>
          <ul class="ticks"><li v-for="r in reasons" :key="r">{{ r }}</li></ul>
          <NuxtLink to="/about/about-us" class="btn btn-dark">About us</NuxtLink>
        </div>
      </div>
    </section>

    <!-- STATS -->
    <section class="section dark">
      <div class="container">
        <div class="stats"><StatCounter v-for="s in stats" :key="s.label" v-bind="s" /></div>
      </div>
    </section>

    <!-- WHAT WE DO -->
    <section class="section">
      <div class="container">
        <div class="head-row">
          <div><span class="eyebrow">Solutions</span><h2>What can we help you with?</h2></div>
          <div class="pills" role="tablist" aria-label="Filter solutions">
            <button v-for="f in (['all','physical','digital'] as const)" :key="f" role="tab" :aria-selected="filter === f" :class="{ on: filter === f }" @click="filter = f">
              {{ f === 'all' ? 'All' : f === 'physical' ? 'Product' : 'Digital' }}
            </button>
          </div>
        </div>
        <TransitionGroup name="tile" tag="div" class="grid g4">
          <NuxtLink v-for="c in tiles" :key="c.slug" :to="`/solutions/${c.slug}`" class="card tile">
            <div class="icon">{{ c.icon }}</div><h3>{{ c.title }}</h3><p>{{ c.tagline }}</p>
          </NuxtLink>
        </TransitionGroup>
      </div>
    </section>

    <!-- QUOTE -->
    <section class="section alt">
      <div class="container"><blockquote class="pull">“The label is the one piece of a brand that travels with the product for its whole life. It deserves the same care as the product itself.”<cite>— Northloom design principle</cite></blockquote></div>
    </section>

    <!-- FEATURE -->
    <section class="section">
      <div class="container split">
        <div>
          <span class="eyebrow">Digital</span>
          <h2>ThreadID: your product data, connected</h2>
          <p class="lead">Certificates, materials, packaging and consumer content in one platform — ready for Digital Product Passports.</p>
          <NuxtLink to="/solutions/threadid" class="btn btn-dark">Discover ThreadID</NuxtLink>
        </div>
        <ArtPanel seed="threadid-feature" label="ThreadID" />
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="section alt">
      <div class="container">
        <span class="eyebrow">Customer voices</span><h2>What brands say</h2>
        <div class="grid g3" style="margin-top:24px">
          <figure v-for="t in testimonials" :key="t.company" class="card quote"><blockquote>“{{ t.quote }}”</blockquote><figcaption><strong>{{ t.name }}</strong><br><span class="muted">{{ t.company }}</span></figcaption></figure>
        </div>
      </div>
    </section>

    <!-- NEWS -->
    <section class="section">
      <div class="container">
        <div class="head-row"><div><span class="eyebrow">News & Insights</span><h2>Latest from Northloom</h2></div><NuxtLink to="/resources/news" class="link-arrow">All news</NuxtLink></div>
        <div class="grid g4"><NewsCard v-for="a in latest" :key="a.slug" :a="a" /></div>
      </div>
    </section>

    <CtaBlock />
  </div>
</template>

<style scoped>
.hero { position: relative; overflow: hidden; background: var(--brand); color: #fff; padding: clamp(80px, 12vw, 160px) 0; }
.hero h1 { color: #fff; max-width: 820px; }
.hero h1 em { font-style: italic; color: var(--accent); }
.hero .lead { color: #c9d6d4; }
.hero .eyebrow { color: var(--accent); }
.hero-in { position: relative; z-index: 1; }
.hero-cta { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
.hero-bg span { position: absolute; border-radius: 50%; filter: blur(40px); opacity: .35; width: 380px; height: 380px; background: radial-gradient(circle, #2a9d8f, transparent 70%);
  left: calc(var(--i) * 16% - 10%); top: calc(var(--i) * 9% - 20%); animation: float 14s ease-in-out infinite alternate; animation-delay: calc(var(--i) * -2s); }
.hero-bg span:nth-child(even) { background: radial-gradient(circle, #e9c46a, transparent 70%); opacity: .2; }
@keyframes float { to { transform: translate(60px, 40px) scale(1.15); } }
@media (prefers-reduced-motion: reduce) { .hero-bg span { animation: none; } }
.logos { padding: 40px 0 56px; }
.ticks { list-style: none; padding: 0; margin: 0 0 28px; }
.ticks li { padding: 10px 0 10px 32px; position: relative; border-bottom: 1px solid var(--line); }
.ticks li::before { content: '✓'; position: absolute; left: 0; color: var(--ok); font-weight: 700; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 32px; text-align: center; }
.head-row { display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; flex-wrap: wrap; margin-bottom: 28px; }
.pills { display: flex; gap: 6px; background: var(--bg-2); padding: 5px; border-radius: 999px; }
.pills button { border: 0; background: none; padding: 8px 18px; border-radius: 999px; font: inherit; font-weight: 600; font-size: .88rem; cursor: pointer; color: var(--ink-2); }
.pills button.on { background: #fff; color: var(--brand); box-shadow: 0 2px 8px rgba(0,0,0,.08); }
.tile-move, .tile-enter-active, .tile-leave-active { transition: all .3s; }
.tile-enter-from, .tile-leave-to { opacity: 0; transform: scale(.96); }
.tile-leave-active { position: absolute; }
.pull { font-family: var(--serif); font-size: clamp(1.4rem, 3vw, 2.2rem); line-height: 1.35; max-width: 900px; margin: 0 auto; text-align: center; color: var(--brand); }
.pull cite { display: block; font-family: var(--sans); font-size: .95rem; font-style: normal; color: var(--ink-2); margin-top: 18px; }
.quote { margin: 0; }
.quote blockquote { margin: 0 0 20px; font-size: 1.05rem; flex: 1; }
</style>
