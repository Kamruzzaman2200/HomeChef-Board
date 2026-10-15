<script setup lang="ts">
import { brand, locations } from '~/data/site'
useHead({ title: 'Contact' })
</script>
<template>
  <div>
    <section class="section"><div class="container split" style="align-items:start">
      <div>
        <nav class="breadcrumbs"><NuxtLink to="/">Home</NuxtLink><span>/</span><span>Contact</span></nav>
        <span class="eyebrow">Contact our team</span>
        <h1>Let’s talk</h1>
        <p class="lead">Tell us about your product, timeline and volumes. A specialist will reply within one business day.</p>
        <div class="info">
          <div><strong>Email</strong><a :href="`mailto:${brand.email}`">{{ brand.email }}</a></div>
          <div><strong>Phone</strong><a :href="`tel:${brand.phone.replace(/\s/g, '')}`">{{ brand.phone }}</a></div>
          <div><strong>Head office</strong><span>{{ brand.address }}</span></div>
          <div><strong>Other sites</strong><NuxtLink to="/about/locations">{{ locations.length }} locations →</NuxtLink></div>
          <div><strong>Looking for a job?</strong><NuxtLink to="/careers">See open positions →</NuxtLink></div>
        </div>
      </div>
      <div class="card"><ContactForm /></div>
    </div></section>
  </div>
</template>
<style scoped>
.info { display: grid; gap: 18px; margin-top: 28px; }
.info div { display: flex; flex-direction: column; }
.info strong { font-size: .8rem; text-transform: uppercase; letter-spacing: .1em; color: var(--ink-2); }
.info a { font-weight: 600; color: var(--brand-2); }
</style>
