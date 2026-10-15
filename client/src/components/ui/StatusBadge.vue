<script setup lang="ts">
import { computed } from 'vue';
import { OrderStatus } from '@/types';
import {
  Clock,
  Check,
  Flame,
  CheckCircle2,
  XCircle,
  PackageCheck,
} from 'lucide-vue-next';

interface Props {
  status: OrderStatus;
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const config = computed(() => {
  switch (props.status) {
    case 'REQUESTED':
      return {
        label: 'Requested',
        classes: 'bg-amber-100 text-amber-900 border-amber-200',
        icon: Clock,
      };
    case 'CONFIRMED':
      return {
        label: 'Confirmed',
        classes: 'bg-blue-100 text-blue-900 border-blue-200',
        icon: Check,
      };
    case 'PREPARING':
      return {
        label: 'Preparing',
        classes: 'bg-orange-100 text-orange-950 border-orange-300 font-semibold animate-pulse',
        icon: Flame,
      };
    case 'READY':
      return {
        label: 'Ready',
        classes: 'bg-kitchen-100 text-kitchen-900 border-kitchen-300 font-semibold',
        icon: PackageCheck,
      };
    case 'COMPLETED':
      return {
        label: 'Completed',
        classes: 'bg-stone-100 text-stone-700 border-stone-200',
        icon: CheckCircle2,
      };
    case 'CANCELLED':
      return {
        label: 'Cancelled',
        classes: 'bg-rose-100 text-rose-800 border-rose-200',
        icon: XCircle,
      };
    default:
      return {
        label: props.status,
        classes: 'bg-stone-100 text-stone-700 border-stone-200',
        icon: Clock,
      };
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'text-xs px-2 py-0.5 gap-1';
    case 'lg':
      return 'text-sm px-3.5 py-1.5 gap-2 font-medium';
    case 'md':
    default:
      return 'text-xs px-2.5 py-1 gap-1.5 font-medium';
  }
});
</script>

<template>
  <span
    :class="[
      'inline-flex items-center rounded-full border transition-colors select-none',
      config.classes,
      sizeClasses,
    ]"
  >
    <component :is="config.icon" class="w-3.5 h-3.5 shrink-0" />
    <span>{{ config.label }}</span>
  </span>
</template>
