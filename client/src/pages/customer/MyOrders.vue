<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useAuthStore } from '@/stores/auth';
import OrderCard from '@/components/orders/OrderCard.vue';
import Button from '@/components/ui/Button.vue';
import {
  ClipboardList,
  Plus,
  Search,
} from 'lucide-vue-next';

const router = useRouter();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const searchFilter = ref('');
const statusTab = ref<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

onMounted(async () => {
  await orderStore.loadOrders(authStore.currentUser?.id);
});

const myOrders = computed(() => {
  return orderStore.orders.filter((order) => {
    // If logged in as customer, filter by user; if admin, show all
    const userMatch = authStore.isAdmin || order.userId === authStore.currentUser?.id;
    const tabMatch =
      statusTab.value === 'ALL'
        ? true
        : statusTab.value === 'ACTIVE'
        ? ['REQUESTED', 'CONFIRMED', 'PREPARING', 'READY'].includes(order.status)
        : ['COMPLETED', 'CANCELLED'].includes(order.status);

    const searchMatch =
      !searchFilter.value ||
      order.id.toLowerCase().includes(searchFilter.value.toLowerCase()) ||
      order.items.some((i) =>
        i.itemNameSnapshot.toLowerCase().includes(searchFilter.value.toLowerCase())
      );

    return userMatch && tabMatch && searchMatch;
  });
});

function handleViewOrder(order: any) {
  router.push(`/orders/${order.id}`);
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
      <div>
        <span class="text-xs font-bold text-kitchen-700 uppercase tracking-wider">Order History</span>
        <h1 class="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">My Kitchen Pre-Orders</h1>
        <p class="text-sm text-stone-600 mt-1">
          Track preparation status in real time and review past batch receipts.
        </p>
      </div>

      <Button variant="default" size="md" @click="router.push('/order')">
        <Plus class="w-4 h-4" />
        <span>New Pre-Order</span>
      </Button>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
      <!-- Tabs -->
      <div class="flex items-center gap-1.5 w-full sm:w-auto">
        <button
          @click="statusTab = 'ALL'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
            statusTab === 'ALL' ? 'bg-kitchen-800 text-white' : 'text-stone-600 hover:bg-stone-100'
          ]"
        >
          All Orders
        </button>
        <button
          @click="statusTab = 'ACTIVE'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
            statusTab === 'ACTIVE' ? 'bg-kitchen-800 text-white' : 'text-stone-600 hover:bg-stone-100'
          ]"
        >
          Active / Kitchen Prep
        </button>
        <button
          @click="statusTab = 'COMPLETED'"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
            statusTab === 'COMPLETED' ? 'bg-kitchen-800 text-white' : 'text-stone-600 hover:bg-stone-100'
          ]"
        >
          Completed
        </button>
      </div>

      <!-- Search Box -->
      <div class="relative w-full sm:w-64">
        <Search class="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        <input
          v-model="searchFilter"
          type="text"
          placeholder="Search by order ID or item..."
          class="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-kitchen-600"
        />
      </div>
    </div>

    <!-- Orders Grid -->
    <div v-if="orderStore.loading" class="py-12 text-center text-stone-600 text-sm">
      Checking order tickets...
    </div>

    <div v-else-if="myOrders.length === 0" class="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
      <div class="w-12 h-12 rounded-full bg-cream-200 text-stone-600 mx-auto flex items-center justify-center">
        <ClipboardList class="w-6 h-6" />
      </div>
      <h3 class="text-base font-bold text-stone-900">No Orders Found</h3>
      <p class="text-xs text-stone-600 max-w-sm mx-auto">
        You don't have any orders matching your selected criteria. Ready for fresh kitchen bread or dinner?
      </p>
      <Button variant="default" size="sm" @click="router.push('/order')">
        Place Your First Order
      </Button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <OrderCard
        v-for="order in myOrders"
        :key="order.id"
        :order="order"
        @click="handleViewOrder"
      />
    </div>
  </div>
</template>
