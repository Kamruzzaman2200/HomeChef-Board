<script setup lang="ts">
const open = useState('announce', () => true)
</script>
<template>
  <div v-if="open" class="ann">
    <div class="container ann-in">
      <NuxtLink to="/news/spring-trims-collection">New: the Spring trims collection is here <span aria-hidden="true">→</span></NuxtLink>
      <button aria-label="Dismiss announcement" @click="open = false">×</button>
    </div>
  </div>
</template>
<style scoped>
.ann { background: var(--accent); color: var(--accent-ink); font-size: .88rem; font-weight: 600; }
.ann-in { display: flex; justify-content: center; align-items: center; gap: 12px; padding-top: 8px; padding-bottom: 8px; position: relative; }
.ann a:hover { color: var(--accent-ink); text-decoration: underline; }
button { position: absolute; right: 16px; background: none; border: 0; font-size: 1.3rem; cursor: pointer; color: inherit; line-height: 1; }
</style>
