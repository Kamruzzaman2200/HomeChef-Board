<script setup lang="ts">
import { computed } from 'vue';
import { MenuItem } from '@/types';
import { useCartStore } from '@/stores/cart';
import { Plus, Check, UtensilsCrossed } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
import Badge from '@/components/ui/Badge.vue';

interface Props {
  item: MenuItem;
  showActions?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
});

const cartStore = useCartStore();

const cartItem = computed(() =>
  cartStore.items.find((i) => i.menuItem.id === props.item.id)
);

const isAdded = computed(() => !!cartItem.value);

function handleAddToCart() {
  if (!props.item.available) return;
  cartStore.addItem(props.item, 1);
}
</script>

<template>
  <div
    :class="[
      'bg-white rounded-2xl border border-stone-200/90 shadow-soft overflow-hidden flex flex-col transition-all duration-300 hover:shadow-soft-lg group',
      !item.available ? 'opacity-70 bg-stone-50/70' : ''
    ]"
  >
    <!-- Food Image -->
    <div class="relative h-48 w-full overflow-hidden bg-stone-100">
      <img
        v-if="item.image"
        :src="item.image"
        :alt="item.name"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-stone-400 bg-cream-200">
        <UtensilsCrossed class="w-12 h-12" />
      </div>

      <!-- Category Pill -->
      <div class="absolute top-3 left-3">
        <Badge variant="kitchen">
          {{ item.category }}
        </Badge>
      </div>

      <!-- Availability status badge -->
      <div class="absolute top-3 right-3">
        <span
          v-if="item.available"
          class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-kitchen-800/90 text-white backdrop-blur-xs shadow-xs"
        >
          Fresh & Ready
        </span>
        <span
          v-else
          class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-stone-800/80 text-white backdrop-blur-xs shadow-xs"
        >
          Sold Out
        </span>
      </div>
    </div>

    <!-- Content -->
    <div class="p-5 flex-1 flex flex-col justify-between">
      <div>
        <div class="flex items-start justify-between gap-2">
          <h3 class="font-bold text-base text-stone-900 group-hover:text-kitchen-800 transition-colors line-clamp-1">
            {{ item.name }}
          </h3>
          <span class="font-extrabold text-base text-kitchen-800 shrink-0">
            ${{ Number(item.price).toFixed(2) }}
          </span>
        </div>

        <p class="mt-2 text-xs text-stone-600 line-clamp-2 leading-relaxed">
          {{ item.description || 'Artisan batch prepared with premium ingredients.' }}
        </p>
      </div>

      <!-- Action Footer -->
      <div v-if="showActions" class="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
        <span class="text-[11px] text-stone-600 font-medium">
          Pre-order batch
        </span>

        <div v-if="item.available">
          <Button
            v-if="!isAdded"
            size="sm"
            variant="default"
            @click="handleAddToCart"
            class="shadow-xs"
          >
            <Plus class="w-3.5 h-3.5" />
            <span>Add to Order</span>
          </Button>
          <div v-else class="flex items-center gap-1.5 bg-kitchen-50 border border-kitchen-200 rounded-lg px-2 py-1">
            <Check class="w-3.5 h-3.5 text-kitchen-700" />
            <span class="text-xs font-bold text-kitchen-800">{{ cartItem?.quantity }} in cart</span>
            <button
              @click="cartStore.addItem(item, 1)"
              class="w-5 h-5 rounded flex items-center justify-center bg-kitchen-800 text-white hover:bg-kitchen-700 text-xs ml-1 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
        <div v-else>
          <span class="text-xs text-stone-400 font-medium italic">
            Unavailable today
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
