<script setup lang="ts">
import { computed } from 'vue';
import { Order, OrderStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import {
  Clock,
  MapPin,
  ArrowRight,
  User,
  ShoppingBag,
  FileText,
} from 'lucide-vue-next';

interface Props {
  order: Order;
  compact?: boolean;
  isAdmin?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  isAdmin: false,
});

const emit = defineEmits<{
  (e: 'update-status', orderId: string, newStatus: OrderStatus): void;
  (e: 'click', order: Order): void;
}>();

const nextStatus = computed<OrderStatus | null>(() => {
  switch (props.order.status) {
    case 'REQUESTED':
      return 'CONFIRMED';
    case 'CONFIRMED':
      return 'PREPARING';
    case 'PREPARING':
      return 'READY';
    case 'READY':
      return 'COMPLETED';
    default:
      return null;
  }
});

const nextActionLabel = computed(() => {
  switch (props.order.status) {
    case 'REQUESTED':
      return 'Confirm Order';
    case 'CONFIRMED':
      return 'Start Prep';
    case 'PREPARING':
      return 'Mark Ready';
    case 'READY':
      return 'Complete Order';
    default:
      return '';
  }
});

function handleAdvance() {
  if (nextStatus.value) {
    emit('update-status', props.order.id, nextStatus.value);
  }
}
</script>

<template>
  <div
    class="bg-white rounded-xl border border-stone-200/90 shadow-2xs hover:shadow-soft transition-all duration-200 p-4 flex flex-col justify-between cursor-pointer"
    @click="$emit('click', order)"
  >
    <!-- Header: Order ID + Status -->
    <div class="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
      <div>
        <div class="flex items-center gap-2">
          <span class="font-extrabold text-sm text-stone-900 tracking-tight">
            {{ order.id }}
          </span>
          <span
            :class="[
              'text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded',
              order.fulfillType === 'PICKUP'
                ? 'bg-amber-100 text-amber-900'
                : 'bg-emerald-100 text-emerald-900'
            ]"
          >
            {{ order.fulfillType }}
          </span>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-stone-600 mt-1">
          <Clock class="w-3.5 h-3.5 text-kitchen-700" />
          <span class="font-semibold text-stone-700">{{ order.fulfillTime }}</span>
          <span v-if="order.fulfillDate" class="text-[11px] text-stone-600">({{ order.fulfillDate }})</span>
        </div>
      </div>

      <StatusBadge :status="order.status" size="sm" />
    </div>

    <!-- Customer Details -->
    <div class="py-2.5">
      <div class="flex items-center gap-1.5 text-xs font-semibold text-stone-800">
        <User class="w-3.5 h-3.5 text-stone-600" />
        <span>{{ order.user?.name || 'Customer' }}</span>
        <span v-if="order.user?.phone" class="text-stone-600 text-[11px] font-normal">({{ order.user.phone }})</span>
      </div>

      <div v-if="order.addressNote" class="flex items-start gap-1 text-[11px] text-stone-600 mt-1">
        <MapPin class="w-3 h-3 text-stone-600 shrink-0 mt-0.5" />
        <span class="truncate">{{ order.addressNote }}</span>
      </div>

      <!-- Items List -->
      <div class="mt-2.5 space-y-1 bg-cream-50/70 p-2 rounded-lg border border-cream-200/60">
        <div
          v-for="(item, idx) in order.items"
          :key="idx"
          class="flex items-center justify-between text-xs"
        >
          <span class="text-stone-800 font-medium truncate">
            <span class="font-bold text-kitchen-800 mr-1">{{ item.quantity }}x</span>
            {{ item.itemNameSnapshot }}
          </span>
          <span class="text-stone-600 text-[11px] shrink-0 ml-2">
            ${{ (Number(item.unitPrice) * item.quantity).toFixed(2) }}
          </span>
        </div>
      </div>

      <!-- Chef / Customer Notes -->
      <div v-if="order.notes" class="mt-2 text-[11px] text-amber-900 bg-amber-50 p-1.5 rounded border border-amber-200/60 flex items-start gap-1">
        <FileText class="w-3 h-3 text-amber-700 shrink-0 mt-0.5" />
        <span class="line-clamp-2">"{{ order.notes }}"</span>
      </div>
    </div>

    <!-- Footer: Price & Status Action -->
    <div class="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
      <div>
        <span class="text-[10px] text-stone-600 uppercase font-semibold block">Total</span>
        <span class="text-base font-extrabold text-kitchen-900">
          ${{ Number(order.total).toFixed(2) }}
        </span>
      </div>

      <!-- Kitchen Advance Action (Admin Only) -->
      <div v-if="isAdmin && nextStatus" @click.stop>
        <button
          @click="handleAdvance"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-kitchen-800 text-white hover:bg-kitchen-700 active:bg-kitchen-900 transition-colors shadow-2xs cursor-pointer"
        >
          <span>{{ nextActionLabel }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </button>
      </div>
      <div v-else-if="!isAdmin">
        <RouterLink
          :to="`/orders/${order.id}`"
          @click.stop
          class="inline-flex items-center gap-1 text-xs font-semibold text-kitchen-800 hover:text-kitchen-900 underline"
        >
          <ShoppingBag class="w-3 h-3" />
          <span>Details</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>
