<script setup lang="ts">
import { legalPages } from '~/data/site'
const route = useRoute()
const page = legalPages[route.params.slug as string]
if (!page) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })
useHead({ title: page.title })
const cookie = useState<string | null>('cookieChoice')
</script>
<template>
  <section v-if="page" class="section"><div class="container" style="max-width:820px">
    <nav class="breadcrumbs"><NuxtLink to="/">Home</NuxtLink><span>/</span><span>{{ page.title }}</span></nav>
    <h1>{{ page.title }}</h1>
    <p v-for="(p, i) in page.body" :key="i">{{ p }}</p>
    <button v-if="route.params.slug === 'cookies'" class="btn btn-dark" @click="cookie = null">Change cookie settings</button>
    <NuxtLink v-if="route.params.slug === 'ethics-hotline'" to="/contact?topic=Ethics%20report" class="btn btn-dark">Make a report</NuxtLink>
  </div></section>
</template>
