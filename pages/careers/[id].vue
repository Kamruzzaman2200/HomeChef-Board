<script setup lang="ts">
import { jobs } from '~/data/site'
const route = useRoute()
const job = jobs.find(j => j.id === route.params.id)
if (!job) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useHead({ title: job.title })
</script>
<template>
  <div v-if="job">
    <section class="section"><div class="container split" style="align-items:start">
      <div>
        <nav class="breadcrumbs"><NuxtLink to="/">Home</NuxtLink><span>/</span><NuxtLink to="/careers">Careers</NuxtLink><span>/</span><span>{{ job.title }}</span></nav>
        <span class="eyebrow">{{ job.team }} · {{ job.location }} · {{ job.type }}</span>
        <h1>{{ job.title }}</h1>
        <h3>About the role</h3>
        <p>You’ll join our {{ job.team.toLowerCase() }} team in {{ job.location }} and work directly with brand customers and production colleagues. Replace this text with the real job description.</p>
        <h3>What you’ll do</h3>
        <ul><li>Own projects end-to-end with clear goals</li><li>Collaborate across studio, production and digital teams</li><li>Help improve how we work every quarter</li></ul>
        <h3>What we offer</h3>
        <ul><li>Competitive salary and annual bonus</li><li>Learning budget and mentoring</li><li>Flexible hours and hybrid working where possible</li></ul>
      </div>
      <div class="card"><h2>Apply now</h2><ApplyForm :job-id="job.id" :job-title="job.title" /></div>
    </div></section>
  </div>
</template>
