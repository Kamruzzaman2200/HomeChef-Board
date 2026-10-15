<script setup lang="ts">
interface Props {
  as?: string;
  padding?: boolean;
}

withDefaults(defineProps<Props>(), {
  as: 'div',
  padding: true,
});
</script>

<template>
  <component
    :is="as"
    :class="[
      'bg-white rounded-xl border border-stone-200/80 shadow-soft transition-all duration-200',
      padding ? 'p-5 md:p-6' : '',
    ]"
  >
    <slot />
  </component>
</template>
