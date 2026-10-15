<script setup lang="ts">
defineProps<{ title?: string; text?: string }>()
</script>
<template>
  <section class="section">
    <div class="container">
      <div class="cta">
        <div>
          <h2>{{ title || 'Ready to talk about your next project?' }}</h2>
          <p class="lead">{{ text || 'Tell us what you’re working on — we’ll reply within one business day.' }}</p>
        </div>
        <NuxtLink to="/contact" class="btn btn-primary">Contact us</NuxtLink>
      </div>
    </div>
  </section>
</template>
<style scoped>
.cta { background: var(--brand); color: #fff; border-radius: 24px; padding: clamp(32px, 5vw, 64px); display: flex; justify-content: space-between; align-items: center; gap: 24px; flex-wrap: wrap; }
.cta h2 { color: #fff; }
.cta .lead { color: #c9d6d4; margin: 0; }
</style>
