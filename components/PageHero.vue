<script setup lang="ts">
defineProps<{ title: string; lead?: string; eyebrow?: string; crumbs?: { label: string; to?: string }[]; seed?: string; icon?: string }>()
</script>
<template>
  <section class="ph">
    <div class="container split">
      <div>
        <nav v-if="crumbs?.length" class="breadcrumbs" aria-label="Breadcrumb">
          <NuxtLink to="/">Home</NuxtLink>
          <template v-for="c in crumbs" :key="c.label"><span>/</span><NuxtLink v-if="c.to" :to="c.to">{{ c.label }}</NuxtLink><span v-else aria-current="page">{{ c.label }}</span></template>
        </nav>
        <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
        <h1>{{ title }}</h1>
        <p v-if="lead" class="lead">{{ lead }}</p>
        <slot />
      </div>
      <ArtPanel :seed="seed || title" :label="icon" ratio="16/11" />
    </div>
  </section>
</template>
<style scoped>
.ph { padding: clamp(40px, 6vw, 80px) 0; border-bottom: 1px solid var(--line); }
</style>
