<script setup lang="ts">
import { findCategory, categories } from '~/data/site'
const route = useRoute()
const cat = findCategory(route.params.cat as string)
if (!cat) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useHead({ title: cat.title, meta: [{ name: 'description', content: cat.intro }] })
const related = categories.filter(c => c.group === cat.group && c.slug !== cat.slug).slice(0, 3)
const steps = ['Brief & consultation', 'Design and sampling in our studio', 'Approval with digital proofs', 'Production close to your factories', 'Delivery and re-order support']
</script>
<template>
  <div v-if="cat">
    <PageHero :title="cat.title" :lead="cat.intro" :eyebrow="cat.group === 'digital' ? 'Digital solutions' : 'Product solutions'" :crumbs="[{ label: 'Solutions', to: '/solutions' }, { label: cat.title }]" :seed="cat.slug" :icon="cat.icon">
      <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:12px">
        <NuxtLink :to="`/contact?topic=${encodeURIComponent(cat.title)}`" class="btn btn-dark">Talk to a specialist</NuxtLink>
        <NuxtLink to="/contact?topic=Request%20samples" class="btn btn-ghost">Request samples</NuxtLink>
      </div>
    </PageHero>

    <section v-if="cat.items.length" class="section">
      <div class="container">
        <h2>{{ cat.tagline }}</h2>
        <div class="grid g3" style="margin-top:28px">
          <NuxtLink v-for="i in cat.items" :key="i.slug" :to="`/solutions/${cat.slug}/${i.slug}`" class="card">
            <ArtPanel :seed="i.slug" ratio="16/10" /><h3 style="margin-top:18px">{{ i.title }}</h3><p>{{ i.summary }}</p><span class="link-arrow">Learn more</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section" :class="{ alt: cat.items.length }">
      <div class="container split">
        <div>
          <span class="eyebrow">How we work</span><h2>From brief to delivery</h2>
          <ol class="steps"><li v-for="s in steps" :key="s">{{ s }}</li></ol>
        </div>
        <ArtPanel :seed="cat.slug + '-process'" ratio="1/1" />
      </div>
    </section>

    <section v-if="related.length" class="section">
      <div class="container">
        <h2>Related solutions</h2>
        <div class="grid g3" style="margin-top:24px">
          <NuxtLink v-for="r in related" :key="r.slug" :to="`/solutions/${r.slug}`" class="card"><div class="icon">{{ r.icon }}</div><h3>{{ r.title }}</h3><p>{{ r.tagline }}</p></NuxtLink>
        </div>
      </div>
    </section>
    <CtaBlock :title="`Let’s talk ${cat.title.toLowerCase()}`" />
  </div>
</template>
<style scoped>
.steps { counter-reset: s; list-style: none; padding: 0; margin: 20px 0 0; }
.steps li { counter-increment: s; padding: 14px 0 14px 52px; position: relative; border-bottom: 1px solid var(--line); font-weight: 500; }
.steps li::before { content: counter(s); position: absolute; left: 0; top: 10px; width: 34px; height: 34px; border-radius: 50%; background: var(--accent); color: var(--accent-ink); display: grid; place-items: center; font-weight: 700; }
</style>
