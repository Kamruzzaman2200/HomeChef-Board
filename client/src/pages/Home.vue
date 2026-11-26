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
  <div class="space-y-8 sm:space-y-12">
    <!-- Announcement & Fresh Batch Banner -->
    <div class="bg-gradient-to-r from-kitchen-900 via-kitchen-800 to-kitchen-900 text-kitchen-100 text-xs py-2.5 px-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-xs border border-kitchen-700/60 gap-2">
      <div class="flex items-center gap-2 overflow-hidden text-ellipsis">
        <span class="bg-terracotta-500 text-white font-extrabold text-[10px] uppercase px-2 py-0.5 rounded-full tracking-wide shrink-0">Fresh Batch</span>
        <span class="font-medium text-xs text-white">Daily kitchen baking &amp; prep slots are open! Order ahead for guaranteed curbside pickup.</span>
      </div>
      <button
        @click="router.push('/order')"
        class="shrink-0 text-amber-300 hover:text-amber-200 font-bold flex items-center gap-1 text-xs cursor-pointer"
      >
        <span>Reserve Slot</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </button>
    </div>

    <!-- Hero Banner -->
    <section class="relative rounded-3xl overflow-hidden bg-gradient-to-br from-kitchen-950 via-kitchen-900 to-kitchen-850 text-white shadow-soft-lg p-6 sm:p-10 lg:p-12">
      <!-- Atmospheric Kitchen Photography Backdrop with dark overlay -->
      <div
        class="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15 pointer-events-none"
        style="background-image: url('/images/kitchen-bg.jpg');"
      />
      <!-- Decorative background glow blurs -->
      <div class="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-kitchen-600/30 blur-3xl pointer-events-none" />
      <div class="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-terracotta-500/20 blur-3xl pointer-events-none" />

      <div class="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        <!-- Left: Text & Actions (7 columns) -->
        <div class="lg:col-span-7 space-y-5">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-kitchen-800/90 text-kitchen-200 border border-kitchen-700/70 shadow-2xs backdrop-blur-xs">
            <Sparkles class="w-3.5 h-3.5 text-amber-300" />
            <span>Small-Batch Artisan Kitchen &middot; Freshly Prepared to Order</span>
          </div>

          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Handcrafted Meals &amp; Breads, <br />
            <span class="text-kitchen-200 underline decoration-terracotta-400 decoration-wavy decoration-2">Prepared Fresh Daily</span>.
          </h1>

          <p class="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Order small-batch chef dinners, 36-hour fermented sourdoughs, and artisan desserts directly from our kitchen. Prepared with locally sourced ingredients and packed hot for your family.
          </p>

          <!-- Highlights & Trust Badges -->
          <div class="flex flex-wrap items-center gap-2.5 text-xs text-kitchen-100 font-medium pt-1">
            <div class="flex items-center gap-1.5 bg-kitchen-800/80 border border-kitchen-700/80 rounded-lg px-2.5 py-1">
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Scratch-Made</span>
            </div>
            <div class="flex items-center gap-1.5 bg-kitchen-800/80 border border-kitchen-700/80 rounded-lg px-2.5 py-1">
              <Flame class="w-3.5 h-3.5 text-amber-400" />
              <span>Zero Preservatives</span>
            </div>
            <div class="flex items-center gap-1.5 bg-kitchen-800/80 border border-kitchen-700/80 rounded-lg px-2.5 py-1">
              <Clock class="w-3.5 h-3.5 text-kitchen-300" />
              <span>Hot Curbside Pickup</span>
            </div>
          </div>

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

        <!-- Right: Featured Dish Showcase Card (5 columns) -->
        <div class="lg:col-span-5">
          <div class="relative w-full max-w-md mx-auto lg:max-w-none">
            <div class="relative bg-kitchen-900/95 rounded-2xl border border-kitchen-700/80 shadow-2xl overflow-hidden ring-1 ring-white/10 group">
              <!-- Dish Image with Hover Zoom -->
              <div class="relative h-48 sm:h-56 w-full overflow-hidden bg-kitchen-950">
                <img
                  src="/images/hero-spread.jpg"
                  alt="Today's Kitchen Feast"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-kitchen-950 via-transparent to-transparent opacity-80" />

                <!-- Badge overlay -->
                <div class="absolute top-3 left-3 bg-terracotta-600/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1.5 border border-terracotta-400/30">
                  <Flame class="w-3 h-3 text-amber-200" />
                  <span>Chef's Daily Feature</span>
                </div>

                <!-- Rating -->
                <div class="absolute top-3 right-3 bg-kitchen-950/85 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md backdrop-blur-xs flex items-center gap-1 border border-kitchen-700/60">
                  <span>★ 4.9</span>
                  <span class="text-stone-300 text-[10px] font-normal">(180+ Reviews)</span>
                </div>
              </div>

              <!-- Card Content -->
              <div class="p-4 sm:p-5 space-y-3">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-base font-bold text-white tracking-tight">Artisan Handcrafted Spread</h3>
                    <p class="text-xs text-kitchen-200">Slow-braised meats &amp; 36h sourdough boules</p>
                  </div>
                  <span class="text-xs font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                    Prepping Now
                  </span>
                </div>

                <div class="pt-2 border-t border-kitchen-800 flex items-center justify-between text-xs text-kitchen-200">
                  <span class="flex items-center gap-1.5">
                    <Clock class="w-3.5 h-3.5 text-amber-300" />
                    <span>Next batch ready: Today 12:30 PM</span>
                  </span>
                  <button
                    @click="router.push('/order')"
                    class="text-xs font-bold text-white hover:text-kitchen-100 underline decoration-terracotta-400 cursor-pointer"
                  >
                    Order Batch &rarr;
                  </button>
                </div>
              </div>
            </div>
          </div>
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
