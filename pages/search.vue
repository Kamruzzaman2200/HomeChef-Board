<script setup lang="ts">
const route = useRoute()
const q = ref((route.query.q as string) || '')
const { data, refresh } = await useFetch('/api/search', { query: { q } })
watch(() => route.query.q, v => { q.value = (v as string) || '' })
function submit() { navigateTo({ query: { q: q.value } }) }
useHead({ title: 'Search' })
</script>
<template>
  <section class="section"><div class="container" style="max-width:820px">
    <h1>Search</h1>
    <form class="srch" role="search" @submit.prevent="submit">
      <div class="field" style="flex:1"><label for="sq" class="sr-only">Search</label><input id="sq" v-model="q" type="search" placeholder="Search the site"></div>
      <button class="btn btn-dark" type="submit">Search</button>
    </form>
    <template v-if="data?.q">
      <p class="muted">{{ data.results.length }} result{{ data.results.length === 1 ? '' : 's' }} for “{{ data.q }}”</p>
      <NuxtLink v-for="r in data.results" :key="r.to" :to="r.to" class="hit"><span class="tag">{{ r.type }}</span><h3>{{ r.title }}</h3><p class="muted">{{ r.text.slice(0, 160) }}…</p></NuxtLink>
    </template>
  </div></section>
</template>
<style scoped>
.srch { display: flex; gap: 10px; margin: 20px 0 28px; }
.hit { display: block; padding: 20px 0; border-bottom: 1px solid var(--line); }
.hit h3 { margin: 8px 0 4px; }
.hit p { margin: 0; font-size: .92rem; }
</style>
