<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { Order, OrderStatus } from '@/types';
import OrderCard from '@/components/orders/OrderCard.vue';
import Button from '@/components/ui/Button.vue';
import {
  Search,
  RefreshCw,
  Plus,
  Utensils,
} from 'lucide-vue-next';

const router = useRouter();
const orderStore = useOrderStore();

const searchInput = ref('');
const selectedDay = ref<'today' | 'all'>('all');

onMounted(async () => {
  await orderStore.loadOrders();
});

const columns: { status: OrderStatus; title: string; color: string }[] = [
  { status: 'REQUESTED', title: 'New Requested', color: 'border-amber-400' },
  { status: 'CONFIRMED', title: 'Confirmed & Staged', color: 'border-blue-400' },
  { status: 'PREPARING', title: 'In the Oven / Prep', color: 'border-orange-500' },
  { status: 'READY', title: 'Ready for Pickup', color: 'border-kitchen-500' },
  { status: 'COMPLETED', title: 'Completed', color: 'border-stone-400' },
];

const todayStr = new Date().toISOString().split('T')[0];

const filteredOrders = computed(() => {
  return orderStore.orders.filter((order) => {
    // Day filter
    if (selectedDay.value === 'today') {
      if (order.fulfillDate && !order.fulfillDate.startsWith(todayStr)) return false;
    }
    // Search filter
    if (searchInput.value.trim()) {
      const q = searchInput.value.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCustomer = order.user?.name.toLowerCase().includes(q);
      const matchItems = order.items.some((i) => i.itemNameSnapshot.toLowerCase().includes(q));
      return matchId || matchCustomer || matchItems;
    }
    return true;
  });
});

function ordersInColumn(status: OrderStatus): Order[] {
  return filteredOrders.value.filter((o) => o.status === status);
}

async function handleUpdateStatus(orderId: string, newStatus: OrderStatus) {
  await orderStore.updateStatus(orderId, newStatus);
}

function handleOrderClick(order: Order) {
  router.push(`/orders/${order.id}`);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Action Bar -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
      <div>
        <div class="flex items-center gap-2">
          <Utensils class="w-5 h-5 text-kitchen-800" />
          <h1 class="text-2xl font-extrabold text-stone-900 tracking-tight">Kitchen Order Preparation Board</h1>
        </div>
        <p class="text-xs text-stone-600 mt-0.5">
          Live preparation kanban for batch management and pickup coordination.
        </p>
      </div>

      <!-- Controls: Date selector, Refresh & Pre-order -->
      <div class="flex flex-wrap items-center gap-2.5">
        <div class="flex items-center bg-white border border-stone-200 rounded-lg p-0.5 shadow-2xs">
          <button
            @click="selectedDay = 'today'"
            :class="[
              'px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer',
              selectedDay === 'today' ? 'bg-kitchen-800 text-white' : 'text-stone-600 hover:text-stone-900'
            ]"
          >
            Today's Batches
          </button>
          <button
            @click="selectedDay = 'all'"
            :class="[
              'px-3 py-1.5 text-xs font-bold rounded-md transition-colors cursor-pointer',
              selectedDay === 'all' ? 'bg-kitchen-800 text-white' : 'text-stone-600 hover:text-stone-900'
            ]"
          >
            All Scheduled
          </button>
        </div>

        <div class="relative w-48">
          <Search class="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
          <input
            v-model="searchInput"
            type="text"
            placeholder="Search tickets..."
            class="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-kitchen-600"
          />
        </div>

        <button
          @click="orderStore.loadOrders()"
          class="p-2 text-stone-600 hover:text-kitchen-800 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
          title="Refresh board"
        >
          <RefreshCw class="w-4 h-4" />
        </button>

        <Button size="sm" variant="default" @click="router.push('/order')">
          <Plus class="w-3.5 h-3.5" />
          <span>New Ticket</span>
        </Button>
      </div>
    </div>

    <!-- Kanban Board Columns (5 Columns) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
      <div
        v-for="col in columns"
        :key="col.status"
        class="bg-stone-100/70 rounded-2xl p-3 border border-stone-200/80 min-h-[500px] flex flex-col"
      >
        <!-- Column Header -->
        <div :class="['border-t-4 pt-2 pb-3 mb-2 flex items-center justify-between', col.color]">
          <div class="flex items-center gap-1.5">
            <span class="font-extrabold text-xs uppercase tracking-wider text-stone-800">
              {{ col.title }}
            </span>
          </div>
          <span class="w-5 h-5 rounded-full bg-white text-stone-800 font-extrabold text-xs flex items-center justify-center shadow-2xs border border-stone-200">
            {{ ordersInColumn(col.status).length }}
          </span>
        </div>

        <!-- Cards Container -->
        <div class="space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)] pr-0.5">
          <div
            v-if="ordersInColumn(col.status).length === 0"
            class="py-10 text-center text-xs text-stone-600 italic border-2 border-dashed border-stone-200/70 rounded-xl"
          >
            No tickets
          </div>

          <OrderCard
            v-for="order in ordersInColumn(col.status)"
            :key="order.id"
            :order="order"
            :is-admin="true"
            @update-status="handleUpdateStatus"
            @click="handleOrderClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>
