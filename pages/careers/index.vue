<script setup lang="ts">
import { jobs } from '~/data/site'
useHead({ title: 'Careers' })
const q = ref(''), team = ref('All'), loc = ref('All')
const teams = ['All', ...new Set(jobs.map(j => j.team))]
const locs = ['All', ...new Set(jobs.map(j => j.location))]
const list = computed(() => jobs.filter(j =>
  (team.value === 'All' || j.team === team.value) && (loc.value === 'All' || j.location === loc.value) &&
  j.title.toLowerCase().includes(q.value.toLowerCase())))
</script>
<template>
  <div>
    <PageHero title="Careers" lead="Join designers, engineers and makers building the future of product identity." :crumbs="[{ label: 'Careers' }]" seed="careers" />
    <section class="section"><div class="container">
      <div class="filters">
        <div class="field"><label for="jq">Search</label><input id="jq" v-model="q" placeholder="e.g. designer"></div>
        <div class="field"><label for="jt">Team</label><select id="jt" v-model="team"><option v-for="t in teams" :key="t">{{ t }}</option></select></div>
        <div class="field"><label for="jl">Location</label><select id="jl" v-model="loc"><option v-for="l in locs" :key="l">{{ l }}</option></select></div>
      </div>
      <p class="muted" style="margin-top:20px">{{ list.length }} open position{{ list.length === 1 ? '' : 's' }}</p>
      <NuxtLink v-for="j in list" :key="j.id" :to="`/careers/${j.id}`" class="job">
        <div><h3>{{ j.title }}</h3><span class="muted">{{ j.team }} · {{ j.location }} · {{ j.type }}</span></div><span class="link-arrow">View &amp; apply</span>
      </NuxtLink>
      <div v-if="!list.length" class="card" style="text-align:center"><p>No matching roles right now.</p><NuxtLink to="/contact?topic=General%20enquiry" class="btn btn-dark" style="align-self:center">Send an open application</NuxtLink></div>
    </div></section>
  </div>
</template>
<style scoped>
.filters { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px; }
@media (max-width: 700px) { .filters { grid-template-columns: 1fr; } }
.job { display: flex; justify-content: space-between; align-items: center; gap: 16px; padding: 22px 0; border-bottom: 1px solid var(--line); flex-wrap: wrap; }
.job h3 { margin: 0 0 4px; }
</style>
