<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMenuStore } from '@/stores/menu';
import MenuCard from '@/components/menu/MenuCard.vue';
import Button from '@/components/ui/Button.vue';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-vue-next';

const router = useRouter();
const menuStore = useMenuStore();

onMounted(async () => {
  if (menuStore.items.length === 0) {
    await menuStore.loadMenu();
  }
});
</script>

<template>
  <div class="space-y-12">
    <!-- Hero Banner -->
    <section class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-kitchen-900 via-kitchen-800 to-kitchen-900 text-white shadow-soft-lg p-8 sm:p-12 lg:p-16">
      <!-- Decorative background blur -->
      <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-kitchen-600/30 blur-3xl pointer-events-none" />
      <div class="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-terracotta-500/20 blur-3xl pointer-events-none" />

      <div class="relative max-w-3xl space-y-6">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-kitchen-700/80 text-kitchen-200 border border-kitchen-600/50">
          <Sparkles class="w-3.5 h-3.5 text-amber-300" />
          <span>Small-Batch Artisan Kitchen &middot; Freshly Baked to Order</span>
        </div>

        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
          Handcrafted Meals &amp; Breads, <br />
          <span class="text-kitchen-200 underline decoration-terracotta-400 decoration-wavy decoration-2">Prepared Fresh Daily</span>.
        </h1>

        <p class="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          Order small-batch chef dinners, 36-hour fermented sourdoughs, and artisan desserts directly from our kitchen. Prepared with locally sourced ingredients and packed hot for your family.
        </p>

        <div class="pt-2 flex flex-wrap items-center gap-4">
          <Button
            size="lg"
            variant="cream"
            @click="router.push('/order')"
            class="shadow-md font-bold"
          >
            <ShoppingBag class="w-4 h-4 text-kitchen-800" />
            <span>Place Pre-Order</span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            @click="router.push('/menu')"
            class="text-white border-kitchen-400 hover:bg-kitchen-700/50"
          >
            <span>Explore Menu</span>
            <ArrowRight class="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>

    <!-- How It Works Highlights -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-kitchen-100 text-kitchen-800 flex items-center justify-center shrink-0">
          <Clock class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-bold text-base text-stone-900">1. Reserve Your Batch</h3>
          <p class="mt-1 text-xs text-stone-600 leading-relaxed">
            Browse our rotating weekly menu and pick your desired fulfillment date &amp; time.
          </p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
          <Flame class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-bold text-base text-stone-900">2. Cooked in Real-Time</h3>
          <p class="mt-1 text-xs text-stone-600 leading-relaxed">
            Our chef fires dishes specifically for your window to preserve maximum crunch and flavor.
          </p>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-2xs flex items-start gap-4">
        <div class="w-12 h-12 rounded-xl bg-terracotta-100 text-terracotta-800 flex items-center justify-center shrink-0">
          <ShieldCheck class="w-6 h-6" />
        </div>
        <div>
          <h3 class="font-bold text-base text-stone-900">3. Easy Window Pickup</h3>
          <p class="mt-1 text-xs text-stone-600 leading-relaxed">
            Drive by our garden kitchen patio or opt for prompt local courier delivery.
          </p>
        </div>
      </div>
    </section>

    <!-- Today's Menu Catalog Section -->
    <section class="space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span class="text-xs font-bold text-kitchen-700 uppercase tracking-wider">Kitchen Offerings</span>
          <h2 class="text-2xl font-extrabold text-stone-900 tracking-tight">Today's Kitchen Menu</h2>
        </div>

        <!-- Category filter tabs -->
        <div class="flex flex-wrap items-center gap-1.5">
          <button
            v-for="cat in menuStore.categories"
            :key="cat"
            @click="menuStore.selectedCategory = cat"
            :class="[
              'px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer',
              menuStore.selectedCategory === cat
                ? 'bg-kitchen-800 text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Menu Grid -->
      <div v-if="menuStore.loading" class="py-12 text-center text-stone-600 text-sm">
        Firing up kitchen ovens and loading items...
      </div>
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <MenuCard
          v-for="item in menuStore.filteredItems"
          :key="item.id"
          :item="item"
        />
      </div>
    </section>
  </div>
</template>
