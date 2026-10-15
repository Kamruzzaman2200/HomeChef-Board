<script setup lang="ts">
import { industries } from '~/data/site'
useHead({ title: 'Industries' })
</script>
<template>
  <div>
    <PageHero title="Industries we serve" lead="Every category has its own rules, materials and rhythm. Our teams specialise so you don’t have to explain twice." :crumbs="[{ label: 'Industries' }]" seed="industries" />
    <section class="section"><div class="container"><div class="grid g3">
      <NuxtLink v-for="i in industries" :key="i.slug" :to="`/industries/${i.slug}`" class="card"><div class="icon">{{ i.icon }}</div><h3>{{ i.title }}</h3><p>{{ i.text }}</p><span class="link-arrow">Explore</span></NuxtLink>
    </div></div></section>
    <CtaBlock />
  </div>
</template>
