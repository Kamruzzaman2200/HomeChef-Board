<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '@/components/layout/Navbar.vue';
import {
  Kanban,
  LineChart,
  BookOpen,
  ChefHat,
} from 'lucide-vue-next';

const route = useRoute();
const currentPath = computed(() => route.path);
</script>

<template>
  <div class="min-h-screen flex flex-col bg-cream-100">
    <Navbar />

    <!-- Kitchen Control Sub-Bar -->
    <div class="bg-kitchen-900 text-white border-b border-kitchen-950 px-4 sm:px-6 lg:px-8 py-3">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <ChefHat class="w-5 h-5 text-kitchen-300" />
          <span class="text-sm font-bold tracking-wide">Chef Preparation Console</span>
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-kitchen-800 text-kitchen-200 uppercase tracking-wider">
            Live Kitchen
          </span>
        </div>

        <!-- Admin Sub-Navigation Pills -->
        <div class="flex items-center gap-2">
          <RouterLink
            to="/admin/daily-board"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              currentPath === '/admin/daily-board'
                ? 'bg-kitchen-700 text-white shadow-xs'
                : 'text-kitchen-200 hover:bg-kitchen-800/80 hover:text-white'
            ]"
          >
            <Kanban class="w-3.5 h-3.5" />
            <span>Daily Prep Board</span>
          </RouterLink>

          <RouterLink
            to="/admin/dashboard"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              currentPath === '/admin/dashboard'
                ? 'bg-kitchen-700 text-white shadow-xs'
                : 'text-kitchen-200 hover:bg-kitchen-800/80 hover:text-white'
            ]"
          >
            <LineChart class="w-3.5 h-3.5" />
            <span>Kitchen Analytics</span>
          </RouterLink>

          <RouterLink
            to="/admin/menu-management"
            :class="[
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
              currentPath === '/admin/menu-management'
                ? 'bg-kitchen-700 text-white shadow-xs'
                : 'text-kitchen-200 hover:bg-kitchen-800/80 hover:text-white'
            ]"
          >
            <BookOpen class="w-3.5 h-3.5" />
            <span>Menu & Availability</span>
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <slot />
    </main>
  </div>
</template>
