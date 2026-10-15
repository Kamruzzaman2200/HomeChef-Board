<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useOrderStore } from '@/stores/order';
import { useAuthStore } from '@/stores/auth';
import { useMenuStore } from '@/stores/menu';
import { FulfillType } from '@/types';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Card from '@/components/ui/Card.vue';
import {
  ShoppingBag,
  Clock,
  Calendar,
  MapPin,
  Trash2,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  FileText,
} from 'lucide-vue-next';

const router = useRouter();
const cartStore = useCartStore();
const orderStore = useOrderStore();
const authStore = useAuthStore();
const menuStore = useMenuStore();

// Form State
const todayString = new Date().toISOString().split('T')[0];
const fulfillDate = ref(todayString);
const fulfillTime = ref('12:30 PM');
const fulfillType = ref<FulfillType>('PICKUP');
const addressNote = ref('Pickup at rear kitchen gate');
const notes = ref('');
const isSubmitting = ref(false);
const errorMsg = ref('');

const timeSlots = [
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
];

const packagingFee = computed(() => (cartStore.subtotal > 0 ? 1.50 : 0));
const grandTotal = computed(() => cartStore.subtotal + packagingFee.value);

async function handleSubmitOrder() {
  if (cartStore.items.length === 0) {
    errorMsg.value = 'Your pre-order cart is empty. Please select dishes from the menu.';
    return;
  }

  if (!authStore.currentUser) {
    router.push('/login');
    return;
  }

  isSubmitting.value = true;
  errorMsg.value = '';

  try {
    const payload = {
      fulfillDate: fulfillDate.value,
      fulfillTime: fulfillTime.value,
      fulfillType: fulfillType.value,
      addressNote: addressNote.value,
      notes: notes.value,
      items: cartStore.items.map((i) => ({
        menuItemId: i.menuItem.id,
        quantity: i.quantity,
      })),
    };

    const newOrder = await orderStore.placeOrder(payload, authStore.currentUser);
    cartStore.clearCart();
    router.push(`/orders/${newOrder.id}`);
  } catch (err: any) {
    errorMsg.value = err?.message || 'Failed to submit order. Please try again.';
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <!-- Header -->
    <div class="border-b border-stone-200 pb-4">
      <span class="text-xs font-bold text-kitchen-700 uppercase tracking-wider">Kitchen Order Form</span>
      <h1 class="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">Place Your Kitchen Pre-Order</h1>
      <p class="text-sm text-stone-600 mt-1">
        Orders are batched and prepared fresh for your selected date &amp; time slot.
      </p>
    </div>

    <!-- Error Banner -->
    <div v-if="errorMsg" class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
      <AlertCircle class="w-5 h-5 shrink-0" />
      <span>{{ errorMsg }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      <!-- Left Column: Fulfillment Details & Notes (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        
        <!-- Fulfillment Type & Time -->
        <Card>
          <h2 class="text-base font-bold text-stone-900 flex items-center gap-2 mb-4">
            <Clock class="w-4 h-4 text-kitchen-800" />
            <span>Fulfillment Scheduling</span>
          </h2>

          <div class="space-y-4">
            <!-- Pickup vs Delivery Toggle -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Fulfillment Mode
              </label>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  @click="fulfillType = 'PICKUP'; addressNote = 'Pickup at rear kitchen gate'"
                  :class="[
                    'py-3 px-4 rounded-xl border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer',
                    fulfillType === 'PICKUP'
                      ? 'border-kitchen-800 bg-kitchen-50 text-kitchen-900 shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  ]"
                >
                  <MapPin class="w-4 h-4" />
                  <span>Curbside / Window Pickup</span>
                </button>

                <button
                  type="button"
                  @click="fulfillType = 'DELIVERY'; addressNote = ''"
                  :class="[
                    'py-3 px-4 rounded-xl border-2 text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer',
                    fulfillType === 'DELIVERY'
                      ? 'border-kitchen-800 bg-kitchen-50 text-kitchen-900 shadow-2xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                  ]"
                >
                  <ShoppingBag class="w-4 h-4" />
                  <span>Local Courier Delivery</span>
                </button>
              </div>
            </div>

            <!-- Date and Time Slots -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Calendar class="w-3.5 h-3.5 text-stone-600" />
                  <span>Preparation Date</span>
                </label>
                <Input
                  v-model="fulfillDate"
                  type="date"
                  :min="todayString"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5 text-stone-600" />
                  <span>Ready Time Window</span>
                </label>
                <select
                  v-model="fulfillTime"
                  class="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-kitchen-600 focus:border-kitchen-600 shadow-sm"
                >
                  <option v-for="slot in timeSlots" :key="slot" :value="slot">
                    {{ slot }}
                  </option>
                </select>
              </div>
            </div>

            <!-- Address / Pickup Instructions -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">
                {{ fulfillType === 'PICKUP' ? 'Vehicle Description or Pickup Name' : 'Delivery Address & Unit Number' }}
              </label>
              <Input
                v-model="addressNote"
                :placeholder="fulfillType === 'PICKUP' ? 'e.g. Silver Toyota, parking spot #3' : 'e.g. 124 Oak Street, Apt 4B'"
              />
            </div>

            <!-- Kitchen Notes -->
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1 flex items-center gap-1">
                <FileText class="w-3.5 h-3.5 text-stone-600" />
                <span>Special Chef Notes &amp; Dietary Reminders</span>
              </label>
              <textarea
                v-model="notes"
                rows="2"
                placeholder="e.g. Please box sourdough whole, dressing on the side..."
                class="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-kitchen-600 shadow-sm"
              ></textarea>
            </div>
          </div>
        </Card>

        <!-- Quick Add More Items from Menu -->
        <Card>
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-bold text-stone-900">Add Items to this Batch</h3>
            <RouterLink to="/menu" class="text-xs text-kitchen-800 hover:underline font-semibold">
              Browse full catalog &rarr;
            </RouterLink>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div
              v-for="item in menuStore.availableItems.slice(0, 4)"
              :key="item.id"
              class="p-2.5 rounded-lg border border-stone-200 bg-stone-50/50 flex items-center justify-between gap-2"
            >
              <div class="truncate">
                <div class="text-xs font-bold text-stone-900 truncate">{{ item.name }}</div>
                <div class="text-[11px] text-stone-600">${{ Number(item.price).toFixed(2) }}</div>
              </div>
              <Button size="sm" variant="cream" @click="cartStore.addItem(item, 1)">
                <Plus class="w-3 h-3" />
                <span>Add</span>
              </Button>
            </div>
          </div>
        </Card>

      </div>

      <!-- Right Column: Order Summary & Review (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <Card class="sticky top-24">
          <div class="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 class="text-base font-bold text-stone-900 flex items-center gap-2">
              <ShoppingBag class="w-4 h-4 text-kitchen-800" />
              <span>Order Summary</span>
            </h2>
            <span class="text-xs font-semibold text-stone-600">
              {{ cartStore.itemCount }} {{ cartStore.itemCount === 1 ? 'item' : 'items' }}
            </span>
          </div>

          <!-- Empty Cart State -->
          <div v-if="cartStore.items.length === 0" class="py-8 text-center space-y-3">
            <div class="w-12 h-12 rounded-full bg-cream-200 text-stone-600 mx-auto flex items-center justify-center">
              <ShoppingBag class="w-6 h-6" />
            </div>
            <p class="text-xs text-stone-600">Your basket is currently empty.</p>
            <Button size="sm" variant="default" @click="router.push('/menu')">
              Select Dishes from Menu
            </Button>
          </div>

          <!-- Items in Cart -->
          <div v-else class="divide-y divide-stone-100 my-4 max-h-72 overflow-y-auto pr-1">
            <div
              v-for="item in cartStore.items"
              :key="item.menuItem.id"
              class="py-3 flex items-center justify-between gap-2"
            >
              <div class="min-w-0 flex-1">
                <h4 class="text-xs font-bold text-stone-900 truncate">
                  {{ item.menuItem.name }}
                </h4>
                <div class="text-[11px] text-stone-600">
                  ${{ Number(item.menuItem.price).toFixed(2) }} each
                </div>
              </div>

              <!-- Quantity Controls -->
              <div class="flex items-center gap-1.5 shrink-0 bg-stone-100 rounded-lg p-0.5">
                <button
                  type="button"
                  @click="cartStore.updateQuantity(item.menuItem.id, item.quantity - 1)"
                  class="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 cursor-pointer"
                >
                  <Minus class="w-3 h-3" />
                </button>
                <span class="w-5 text-center text-xs font-bold text-stone-800">
                  {{ item.quantity }}
                </span>
                <button
                  type="button"
                  @click="cartStore.addItem(item.menuItem, 1)"
                  class="w-6 h-6 rounded flex items-center justify-center text-stone-600 hover:bg-white hover:text-stone-900 cursor-pointer"
                >
                  <Plus class="w-3 h-3" />
                </button>
              </div>

              <!-- Subtotal per item -->
              <div class="text-right shrink-0 w-16">
                <span class="text-xs font-bold text-stone-900">
                  ${{ (item.menuItem.price * item.quantity).toFixed(2) }}
                </span>
              </div>

              <!-- Remove -->
              <button
                type="button"
                @click="cartStore.removeItem(item.menuItem.id)"
                class="text-stone-600 hover:text-rose-600 p-1 cursor-pointer"
                title="Remove item"
              >
                <Trash2 class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Total Calculation Breakdown -->
          <div v-if="cartStore.items.length > 0" class="pt-3 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
            <div class="flex justify-between">
              <span>Dishes Subtotal</span>
              <span class="font-medium text-stone-800">${{ cartStore.subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between">
              <span>Eco-friendly Thermal Box Packing</span>
              <span class="font-medium text-stone-800">${{ packagingFee.toFixed(2) }}</span>
            </div>
            <div class="pt-2 border-t border-stone-200 flex justify-between items-baseline">
              <span class="text-sm font-bold text-stone-900">Estimated Total</span>
              <span class="text-xl font-extrabold text-kitchen-900">
                ${{ grandTotal.toFixed(2) }}
              </span>
            </div>
            <p class="text-[10px] text-stone-600 italic pt-1">
              * Payment is settled upon pickup/handover. No online card required.
            </p>

            <!-- Submit Button -->
            <div class="pt-4">
              <Button
                type="button"
                variant="default"
                size="lg"
                class="w-full font-bold shadow-md"
                :disabled="isSubmitting"
                @click="handleSubmitOrder"
              >
                <CheckCircle v-if="!isSubmitting" class="w-4 h-4" />
                <span>{{ isSubmitting ? 'Sending to Kitchen...' : 'Confirm Pre-Order' }}</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>

    </div>
  </div>
</template>
