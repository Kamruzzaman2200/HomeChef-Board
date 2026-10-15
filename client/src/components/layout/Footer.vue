<script setup lang="ts">
import { ChefHat, MapPin, Clock, Phone, Heart } from 'lucide-vue-next';
</script>

<template>
  <footer class="bg-white border-t border-stone-200/80 mt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        <!-- Column 1: Brand Info -->
        <div class="space-y-3 md:col-span-1">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-kitchen-800 text-white flex items-center justify-center">
              <ChefHat class="w-4 h-4 text-kitchen-200" />
            </div>
            <span class="font-extrabold text-base text-stone-900 tracking-tight">HomeChef Board</span>
          </div>
          <p class="text-xs text-stone-600 leading-relaxed">
            A small-batch home kitchen preparing wholesome, chef-crafted pre-orders with seasonal ingredients.
          </p>
        </div>

        <!-- Column 2: Pickup & Location -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold text-stone-900 uppercase tracking-wider">Kitchen Location</h4>
          <p class="text-xs text-stone-600 flex items-start gap-1.5">
            <MapPin class="w-3.5 h-3.5 text-kitchen-700 shrink-0 mt-0.5" />
            <span>North Oak Lane, Suite 102<br />Pick-up window at side patio</span>
          </p>
        </div>

        <!-- Column 3: Hours -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold text-stone-900 uppercase tracking-wider">Bake & Prep Hours</h4>
          <p class="text-xs text-stone-600 flex items-start gap-1.5">
            <Clock class="w-3.5 h-3.5 text-kitchen-700 shrink-0 mt-0.5" />
            <span>Thu – Sun: 10:00 AM – 7:00 PM<br />Pre-orders close 24h prior</span>
          </p>
        </div>

        <!-- Column 4: Contact -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold text-stone-900 uppercase tracking-wider">Kitchen Hotline</h4>
          <p class="text-xs text-stone-600 flex items-center gap-1.5">
            <Phone class="w-3.5 h-3.5 text-kitchen-700 shrink-0" />
            <span>(555) 234-8901</span>
          </p>
          <div class="pt-2 text-[11px] text-stone-600 flex items-center gap-1">
            Built with <Heart class="w-3 h-3 text-terracotta-500 fill-terracotta-500" /> for home food artisans
          </div>
        </div>

      </div>

      <div class="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600">
        <p>&copy; 2026 HomeChef Board. All rights reserved.</p>
        <p class="mt-2 sm:mt-0">Pre-order preparation management system</p>
      </div>
    </div>
  </footer>
</template>
