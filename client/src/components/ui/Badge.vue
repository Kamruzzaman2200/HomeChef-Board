<script setup lang="ts">
interface Props {
  variant?: 'default' | 'outline' | 'kitchen' | 'terracotta';
}

withDefaults(defineProps<Props>(), {
  variant: 'default',
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variant === 'default' && 'bg-stone-100 text-stone-800 border border-stone-200',
      variant === 'outline' && 'border border-stone-300 text-stone-700',
      variant === 'kitchen' && 'bg-kitchen-100 text-kitchen-900 border border-kitchen-200',
      variant === 'terracotta' && 'bg-terracotta-100 text-terracotta-900 border border-terracotta-200',
    ]"
  >
    <slot />
  </span>
</template>
