<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { Order, OrderStatus } from '@/types';
import StatusBadge from '@/components/ui/StatusBadge.vue';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle2,
  User,
  ShoppingBag,
  Info,
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();

const order = ref<Order | null>(null);
const loading = ref(true);

const orderId = computed(() => route.params.id as string);

const steps: { status: OrderStatus; label: string; desc: string }[] = [
  { status: 'REQUESTED', label: 'Order Placed', desc: 'Received by kitchen' },
  { status: 'CONFIRMED', label: 'Confirmed', desc: 'Ingredients staged' },
  { status: 'PREPARING', label: 'Cooking & Baking', desc: 'Fired in oven' },
  { status: 'READY', label: 'Ready for Pickup', desc: 'Hot & packaged' },
  { status: 'COMPLETED', label: 'Completed', desc: 'Handed over to customer' },
];

const currentStepIndex = computed(() => {
  if (!order.value) return 0;
  if (order.value.status === 'CANCELLED') return -1;
  return steps.findIndex((s) => s.status === order.value?.status);
});

onMounted(async () => {
  loading.value = true;
  try {
    const found = await orderStore.getOrder(orderId.value);
    order.value = found;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Top Bar Navigation -->
    <div class="flex items-center justify-between">
      <button
        @click="router.back()"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-kitchen-800 transition-colors cursor-pointer"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>Back to Orders</span>
      </button>

      <span v-if="order" class="text-xs text-stone-600">
        Created on {{ new Date(order.createdAt).toLocaleDateString() }}
      </span>
    </div>

    <div v-if="loading" class="py-16 text-center text-stone-600 text-sm">
      Retrieving kitchen order details...
    </div>

    <div v-else-if="!order" class="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
      <h2 class="text-lg font-bold text-stone-900">Order Not Found</h2>
      <p class="text-xs text-stone-600">
        We couldn't find order #{{ orderId }}.
      </p>
      <Button variant="default" size="sm" @click="router.push('/my-orders')">
        View All Orders
      </Button>
    </div>

    <div v-else class="space-y-6">
      
      <!-- Order Header Card -->
      <Card class="bg-gradient-to-r from-kitchen-900 to-kitchen-800 text-white border-0 shadow-soft-lg">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-3">
              <h1 class="text-2xl font-extrabold tracking-tight text-white">Order {{ order.id }}</h1>
              <StatusBadge :status="order.status" size="lg" />
            </div>
            <p class="text-xs text-stone-300 mt-1 flex items-center gap-2">
              <Clock class="w-3.5 h-3.5 text-kitchen-300" />
              <span>Target Ready Time: <strong>{{ order.fulfillTime }}</strong></span>
              <span v-if="order.fulfillDate">&middot; {{ order.fulfillDate }}</span>
            </p>
          </div>

          <div class="text-right sm:border-l sm:border-kitchen-700 sm:pl-6">
            <span class="text-xs uppercase tracking-wider text-kitchen-200 block">Total Due Upon Pickup</span>
            <span class="text-2xl font-extrabold text-white">${{ Number(order.total).toFixed(2) }}</span>
          </div>
        </div>
      </Card>

      <!-- Preparation Stepper Timeline -->
      <Card>
        <h3 class="text-sm font-bold text-stone-900 mb-4 flex items-center gap-2">
          <Clock class="w-4 h-4 text-kitchen-800" />
          <span>Preparation Status Timeline</span>
        </h3>

        <div v-if="order.status === 'CANCELLED'" class="p-4 rounded-xl bg-rose-50 text-rose-800 text-xs font-semibold">
          This order was cancelled. Please contact the kitchen directly with questions.
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div
            v-for="(step, idx) in steps"
            :key="step.status"
            :class="[
              'p-3 rounded-xl border text-center transition-all',
              idx <= currentStepIndex
                ? 'bg-kitchen-50 border-kitchen-300 text-kitchen-900 shadow-2xs'
                : 'bg-stone-50 border-stone-200 text-stone-600 opacity-60'
            ]"
          >
            <div
              :class="[
                'w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold mb-2',
                idx <= currentStepIndex
                  ? 'bg-kitchen-800 text-white'
                  : 'bg-stone-200 text-stone-600'
              ]"
            >
              <CheckCircle2 v-if="idx < currentStepIndex" class="w-4 h-4" />
              <span v-else>{{ idx + 1 }}</span>
            </div>
            <div class="text-xs font-bold truncate">{{ step.label }}</div>
            <div class="text-[10px] mt-0.5 leading-tight opacity-80">{{ step.desc }}</div>
          </div>
        </div>
      </Card>

      <!-- Fulfillment Info & Items Split -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        <!-- Ordered Items Table (7 cols) -->
        <Card class="md:col-span-7">
          <div class="flex items-center justify-between border-b border-stone-100 pb-3 mb-3">
            <h3 class="text-sm font-bold text-stone-900 flex items-center gap-2">
              <ShoppingBag class="w-4 h-4 text-kitchen-800" />
              <span>Prepared Dishes</span>
            </h3>
            <span class="text-xs text-stone-600">{{ order.items.length }} items</span>
          </div>

          <div class="divide-y divide-stone-100">
            <div
              v-for="item in order.items"
              :key="item.id"
              class="py-3 flex items-center justify-between gap-2"
            >
              <div>
                <div class="text-xs font-bold text-stone-900">
                  <span class="text-kitchen-800 font-extrabold mr-1">{{ item.quantity }}x</span>
                  {{ item.itemNameSnapshot }}
                </div>
                <div class="text-[11px] text-stone-600">
                  ${{ Number(item.unitPrice).toFixed(2) }} per unit
                </div>
              </div>
              <div class="text-xs font-extrabold text-stone-900">
                ${{ (Number(item.unitPrice) * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <!-- Total Footer -->
          <div class="mt-4 pt-4 border-t border-stone-200 flex items-center justify-between">
            <div class="text-xs text-stone-600 flex items-center gap-1">
              <Info class="w-3.5 h-3.5 text-kitchen-700" />
              <span>Item prices are preserved historically</span>
            </div>
            <div class="text-base font-extrabold text-kitchen-900">
              Total: ${{ Number(order.total).toFixed(2) }}
            </div>
          </div>
        </Card>

        <!-- Fulfillment & Customer Notes (5 cols) -->
        <div class="md:col-span-5 space-y-6">
          <Card>
            <h3 class="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <MapPin class="w-4 h-4 text-kitchen-800" />
              <span>Fulfillment &amp; Location</span>
            </h3>

            <div class="space-y-3 text-xs">
              <div>
                <span class="text-stone-600 block uppercase text-[10px] font-bold">Fulfillment Mode</span>
                <span class="font-bold text-stone-900 text-sm">{{ order.fulfillType }}</span>
              </div>

              <div>
                <span class="text-stone-600 block uppercase text-[10px] font-bold">Target Window</span>
                <span class="font-semibold text-stone-900">{{ order.fulfillTime }} &middot; {{ order.fulfillDate }}</span>
              </div>

              <div v-if="order.addressNote">
                <span class="text-stone-600 block uppercase text-[10px] font-bold">Instructions / Address</span>
                <p class="font-medium text-stone-800 bg-cream-50 p-2 rounded-lg border border-stone-200 mt-1">
                  {{ order.addressNote }}
                </p>
              </div>

              <div v-if="order.notes">
                <span class="text-stone-600 block uppercase text-[10px] font-bold">Chef Preparation Notes</span>
                <p class="font-medium text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-1">
                  "{{ order.notes }}"
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 class="text-sm font-bold text-stone-900 mb-2 flex items-center gap-2">
              <User class="w-4 h-4 text-kitchen-800" />
              <span>Customer Contact</span>
            </h3>
            <p class="text-xs text-stone-800 font-semibold">{{ order.user?.name || 'Customer' }}</p>
            <p class="text-xs text-stone-600">{{ order.user?.email }}</p>
            <p v-if="order.user?.phone" class="text-xs text-stone-600">{{ order.user.phone }}</p>
          </Card>
        </div>

      </div>

    </div>
  </div>
</template>
