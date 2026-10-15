<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'destructive' | 'cream';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  type: 'button',
});

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'outline':
      return 'border border-kitchen-700 text-kitchen-800 bg-transparent hover:bg-kitchen-50 active:bg-kitchen-100';
    case 'secondary':
      return 'bg-stone-200 text-stone-800 hover:bg-stone-300 active:bg-stone-400';
    case 'ghost':
      return 'text-stone-700 hover:bg-cream-200 active:bg-cream-300';
    case 'destructive':
      return 'bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 shadow-sm';
    case 'cream':
      return 'bg-cream-200 text-kitchen-900 hover:bg-cream-300 border border-cream-300';
    case 'default':
    default:
      return 'bg-kitchen-800 text-white hover:bg-kitchen-700 active:bg-kitchen-900 shadow-sm';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 px-3 text-xs rounded-md gap-1.5';
    case 'lg':
      return 'h-11 px-6 text-base rounded-lg gap-2.5';
    case 'icon':
      return 'h-9 w-9 p-0 rounded-md justify-center';
    case 'md':
    default:
      return 'h-9 px-4 text-sm rounded-md gap-2';
  }
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="[
      'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kitchen-600 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer',
      variantClasses,
      sizeClasses,
    ]"
  >
    <slot />
  </button>
</template>
