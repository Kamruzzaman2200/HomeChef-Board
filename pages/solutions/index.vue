<script setup lang="ts">
import { categories } from '~/data/site'
useHead({ title: 'Solutions' })
const groups = [
  { id: 'physical', title: 'Product solutions', lead: 'Physical branding and packaging, designed and produced in-house.' },
  { id: 'digital', title: 'Digital solutions', lead: 'Product data, identities and connected labels.' },
] as const
</script>
<template>
  <div>
    <PageHero title="Solutions" lead="Everything that carries your brand — from the first tag to the last scan." :crumbs="[{ label: 'Solutions' }]" seed="solutions" />
    <section v-for="g in groups" :id="g.id" :key="g.id" class="section" :class="{ alt: g.id === 'digital' }">
      <div class="container">
        <h2>{{ g.title }}</h2><p class="lead">{{ g.lead }}</p>
        <div class="grid g3" style="margin-top:28px">
          <NuxtLink v-for="c in categories.filter(c => c.group === g.id)" :key="c.slug" :to="`/solutions/${c.slug}`" class="card">
            <div class="icon">{{ c.icon }}</div><h3>{{ c.title }}</h3><p>{{ c.tagline }}</p>
            <span class="muted" style="font-size:.85rem;margin-bottom:12px">{{ c.items.length ? `${c.items.length} solutions` : 'Overview' }}</span>
            <span class="link-arrow">Explore</span>
          </NuxtLink>
        </div>
      </div>
    </section>
    <CtaBlock />
  </div>
</template>
