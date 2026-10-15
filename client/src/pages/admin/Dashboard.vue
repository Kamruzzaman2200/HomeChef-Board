<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useMenuStore } from '@/stores/menu';
import { DashboardStats } from '@/types';
import Card from '@/components/ui/Card.vue';
import Button from '@/components/ui/Button.vue';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import {
  TrendingUp,
  DollarSign,
  Flame,
  PackageCheck,
  Clock,
  ArrowRight,
  UtensilsCrossed,
  ChefHat,
} from 'lucide-vue-next';

const router = useRouter();
const orderStore = useOrderStore();
const menuStore = useMenuStore();

const stats = ref<DashboardStats>({
  requestedCount: 0,
  confirmedCount: 0,
  preparingCount: 0,
  readyCount: 0,
  completedCount: 0,
  todayRevenue: 0,
  totalOrdersCount: 0,
});

onMounted(async () => {
  await Promise.all([orderStore.loadOrders(), menuStore.loadMenu()]);
  stats.value = await orderStore.getStats();
});

const activeOrders = computed(() => {
  return orderStore.orders.filter((o) =>
    ['REQUESTED', 'CONFIRMED', 'PREPARING', 'READY'].includes(o.status)
  );
});
</script>

<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
      <div>
        <span class="text-xs font-bold text-kitchen-700 uppercase tracking-wider">Kitchen Operations</span>
        <h1 class="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">Chef Dashboard &amp; Analytics</h1>
        <p class="text-sm text-stone-600 mt-1">
          Daily throughput, live preparation statuses, and sales performance.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <Button variant="default" size="sm" @click="router.push('/admin/daily-board')">
          <ChefHat class="w-4 h-4" />
          <span>Open Daily Board</span>
        </Button>
      </div>
    </div>

    <!-- Metric Stat Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <!-- Revenue -->
      <Card class="flex items-center gap-4 border-l-4 border-kitchen-600">
        <div class="w-12 h-12 rounded-xl bg-kitchen-100 text-kitchen-800 flex items-center justify-center shrink-0">
          <DollarSign class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs font-bold text-stone-600 uppercase tracking-wider block">Estimated Revenue</span>
          <span class="text-2xl font-extrabold text-stone-900">${{ stats.todayRevenue.toFixed(2) }}</span>
        </div>
      </Card>

      <!-- Active in Prep -->
      <Card class="flex items-center gap-4 border-l-4 border-orange-500">
        <div class="w-12 h-12 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center shrink-0">
          <Flame class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs font-bold text-stone-600 uppercase tracking-wider block">In Oven / Prep</span>
          <span class="text-2xl font-extrabold text-stone-900">{{ stats.preparingCount }}</span>
        </div>
      </Card>

      <!-- Ready for Pickup -->
      <Card class="flex items-center gap-4 border-l-4 border-emerald-500">
        <div class="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
          <PackageCheck class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs font-bold text-stone-600 uppercase tracking-wider block">Ready at Window</span>
          <span class="text-2xl font-extrabold text-stone-900">{{ stats.readyCount }}</span>
        </div>
      </Card>

      <!-- Total Orders Count -->
      <Card class="flex items-center gap-4 border-l-4 border-stone-500">
        <div class="w-12 h-12 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center shrink-0">
          <TrendingUp class="w-6 h-6" />
        </div>
        <div>
          <span class="text-xs font-bold text-stone-600 uppercase tracking-wider block">Total Scheduled</span>
          <span class="text-2xl font-extrabold text-stone-900">{{ stats.totalOrdersCount }}</span>
        </div>
      </Card>
    </div>

    <!-- Active Orders Pipeline & Quick Breakdown -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Live Orders Table (8 cols) -->
      <Card class="lg:col-span-8">
        <div class="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
          <div>
            <h3 class="font-bold text-base text-stone-900">Active Kitchen Pipeline</h3>
            <p class="text-xs text-stone-600">Tickets requiring chef confirmation, cooking, or handover.</p>
          </div>
          <RouterLink
            to="/admin/daily-board"
            class="text-xs font-bold text-kitchen-800 hover:text-kitchen-900 inline-flex items-center gap-1"
          >
            <span>Kanban View</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </RouterLink>
        </div>

        <div v-if="activeOrders.length === 0" class="py-12 text-center text-xs text-stone-600">
          All kitchen orders are currently completed. Ready for new pre-orders!
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider">
                <th class="py-2.5 px-3">Ticket</th>
                <th class="py-2.5 px-3">Customer</th>
                <th class="py-2.5 px-3">Time / Type</th>
                <th class="py-2.5 px-3">Dishes</th>
                <th class="py-2.5 px-3">Status</th>
                <th class="py-2.5 px-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-stone-100">
              <tr
                v-for="order in activeOrders"
                :key="order.id"
                @click="router.push(`/orders/${order.id}`)"
                class="hover:bg-cream-50 transition-colors cursor-pointer"
              >
                <td class="py-3 px-3 font-bold text-stone-900">
                  {{ order.id }}
                </td>
                <td class="py-3 px-3">
                  <div class="font-semibold text-stone-800">{{ order.user?.name || 'Customer' }}</div>
                  <div class="text-[10px] text-stone-600">{{ order.user?.phone }}</div>
                </td>
                <td class="py-3 px-3">
                  <div class="font-bold text-stone-800 flex items-center gap-1">
                    <Clock class="w-3 h-3 text-kitchen-700" />
                    {{ order.fulfillTime }}
                  </div>
                  <div class="text-[10px] text-stone-600">{{ order.fulfillType }}</div>
                </td>
                <td class="py-3 px-3">
                  <span class="text-stone-700">
                    {{ order.items.map(i => `${i.quantity}x ${i.itemNameSnapshot}`).join(', ') }}
                  </span>
                </td>
                <td class="py-3 px-3">
                  <StatusBadge :status="order.status" size="sm" />
                </td>
                <td class="py-3 px-3 text-right font-extrabold text-kitchen-900">
                  ${{ Number(order.total).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      <!-- Menu Health & Quick Actions (4 cols) -->
      <div class="lg:col-span-4 space-y-6">
        <Card>
          <div class="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
            <h3 class="font-bold text-sm text-stone-900 flex items-center gap-2">
              <UtensilsCrossed class="w-4 h-4 text-kitchen-800" />
              <span>Menu Catalog Health</span>
            </h3>
            <RouterLink to="/admin/menu-management" class="text-xs text-kitchen-800 font-bold hover:underline">
              Edit
            </RouterLink>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs">
              <span class="text-stone-600">Total Active Items</span>
              <span class="font-bold text-stone-800">{{ menuStore.items.length }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-stone-600">Available to Order</span>
              <span class="font-bold text-emerald-700">{{ menuStore.availableItems.length }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-stone-600">Sold Out / Paused</span>
              <span class="font-bold text-amber-700">
                {{ menuStore.items.length - menuStore.availableItems.length }}
              </span>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-stone-100">
            <Button
              variant="outline"
              size="sm"
              class="w-full justify-center"
              @click="router.push('/admin/menu-management')"
            >
              Manage Dish Availability
            </Button>
          </div>
        </Card>

        <!-- Kitchen Status Tip -->
        <div class="bg-kitchen-900 text-white rounded-2xl p-5 shadow-soft space-y-2">
          <span class="text-[10px] uppercase tracking-wider font-extrabold text-kitchen-300">
            HomeChef Tip
          </span>
          <h4 class="font-bold text-sm">Batch Timing Recommendation</h4>
          <p class="text-xs text-stone-300 leading-relaxed">
            Sourdough boules require a 45-minute cooling rest before slicing. Mark them "Ready" 15 minutes before the pickup window.
          </p>
        </div>
      </div>

    </div>
  </div>
</template>
