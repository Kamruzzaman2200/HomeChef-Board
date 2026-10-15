<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message?: string } }>()
const is404 = computed(() => props.error?.statusCode === 404)
useHead({ title: is404.value ? 'Page not found' : 'Error' })
</script>
<template>
  <NuxtLayout>
    <section class="section">
      <div class="container" style="text-align:center;max-width:640px">
        <span class="eyebrow">Error {{ error.statusCode }}</span>
        <h1>{{ is404 ? 'We couldn’t find that page' : 'Something went wrong' }}</h1>
        <p class="lead" style="margin:0 auto 2rem">Try the search, or head back to the homepage.</p>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          <button class="btn btn-dark" @click="clearError({ redirect: '/' })">Go to homepage</button>
          <button class="btn btn-ghost" @click="clearError({ redirect: '/search' })">Search the site</button>
        </div>
      </div>
    </section>
  </NuxtLayout>
</template>
