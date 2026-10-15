<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import CustomerLayout from '@/layouts/CustomerLayout.vue';
import AdminLayout from '@/layouts/AdminLayout.vue';

const route = useRoute();

const layoutComponent = computed(() => {
  if (route.meta.layout === 'admin') {
    return AdminLayout;
  }
  return CustomerLayout;
});
</script>

<template>
  <component :is="layoutComponent">
    <RouterView />
  </component>
</template>
