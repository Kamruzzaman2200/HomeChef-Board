<script setup lang="ts">
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import {
  ChefHat,
  ShoppingBag,
  LayoutDashboard,
  UtensilsCrossed,
  Clock,
  ClipboardList,
  LogOut,
  UserCheck,
  Menu as MenuIcon,
} from 'lucide-vue-next';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();

const mobileMenuOpen = ref(false);

const activePath = computed(() => route.path);

function toggleRole() {
  if (authStore.isAdmin) {
    authStore.switchRole('CUSTOMER');
    router.push('/menu');
  } else {
    authStore.switchRole('ADMIN');
    router.push('/admin/daily-board');
  }
}

function handleLogout() {
  authStore.logout();
  router.push('/login');
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200/80 shadow-xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Brand / Logo -->
        <div class="flex items-center gap-3">
          <RouterLink to="/" class="flex items-center gap-2.5 group">
            <div class="w-10 h-10 rounded-xl bg-kitchen-800 text-white flex items-center justify-center shadow-md group-hover:bg-kitchen-700 transition-colors">
              <ChefHat class="w-5 h-5 text-kitchen-200" />
            </div>
            <div>
              <span class="font-extrabold text-lg text-stone-900 tracking-tight block leading-tight">
                HomeChef <span class="text-kitchen-700">Board</span>
              </span>
              <span class="text-[10px] uppercase tracking-widest text-stone-600 font-semibold block">Kitchen Order System</span>
            </div>
          </RouterLink>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-1.5 lg:gap-2">
          <!-- Public / Customer Links -->
          <RouterLink
            to="/menu"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5',
              activePath === '/menu' || activePath === '/'
                ? 'bg-kitchen-50 text-kitchen-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            ]"
          >
            <UtensilsCrossed class="w-4 h-4" />
            Menu
          </RouterLink>

          <RouterLink
            to="/order"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5',
              activePath === '/order'
                ? 'bg-kitchen-50 text-kitchen-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            ]"
          >
            <Clock class="w-4 h-4" />
            Pre-Order
          </RouterLink>

          <RouterLink
            to="/my-orders"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5',
              activePath === '/my-orders'
                ? 'bg-kitchen-50 text-kitchen-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            ]"
          >
            <ClipboardList class="w-4 h-4" />
            My Orders
          </RouterLink>

          <!-- Admin Section Separator -->
          <div class="h-5 w-px bg-stone-200 mx-2" />

          <!-- Admin Links -->
          <RouterLink
            to="/admin/daily-board"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5',
              activePath === '/admin/daily-board'
                ? 'bg-kitchen-800 text-white font-semibold shadow-xs'
                : 'text-kitchen-900 hover:bg-kitchen-50 font-semibold'
            ]"
          >
            <LayoutDashboard class="w-4 h-4" />
            Kitchen Board
          </RouterLink>

          <RouterLink
            to="/admin/dashboard"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              activePath === '/admin/dashboard'
                ? 'bg-kitchen-50 text-kitchen-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            ]"
          >
            Analytics
          </RouterLink>

          <RouterLink
            to="/admin/menu-management"
            :class="[
              'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
              activePath === '/admin/menu-management'
                ? 'bg-kitchen-50 text-kitchen-800 font-semibold'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
            ]"
          >
            Manage Menu
          </RouterLink>
        </nav>

        <!-- Right Side Controls -->
        <div class="flex items-center gap-3">
          
          <!-- Role Switcher Pill -->
          <button
            @click="toggleRole"
            type="button"
            title="Click to toggle between Admin Chef view and Customer view"
            class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer shadow-2xs"
            :class="authStore.isAdmin ? 'bg-kitchen-100 border-kitchen-300 text-kitchen-900' : 'bg-amber-100 border-amber-300 text-amber-900'"
          >
            <UserCheck class="w-3.5 h-3.5" />
            <span>Role: {{ authStore.isAdmin ? 'Admin Chef' : 'Customer' }}</span>
            <span class="text-[10px] underline opacity-75 ml-0.5">(switch)</span>
          </button>

          <!-- Cart Icon -->
          <RouterLink
            to="/order"
            class="relative p-2 text-stone-700 hover:text-kitchen-800 hover:bg-cream-200 rounded-lg transition-colors"
            title="View Pre-Order Cart"
          >
            <ShoppingBag class="w-5 h-5" />
            <span
              v-if="cartStore.itemCount > 0"
              class="absolute -top-1 -right-1 bg-kitchen-800 text-white font-bold text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-white animate-bounce"
            >
              {{ cartStore.itemCount }}
            </span>
          </RouterLink>

          <!-- User Info / Auth -->
          <div v-if="authStore.isAuthenticated" class="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200">
            <div class="text-right">
              <span class="block text-xs font-bold text-stone-900 leading-tight">
                {{ authStore.currentUser?.name }}
              </span>
              <span class="block text-[10px] text-stone-600">
                {{ authStore.currentUser?.role }}
              </span>
            </div>
            <button
              @click="handleLogout"
              class="p-1.5 text-stone-400 hover:text-rose-600 rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>
          <div v-else class="flex items-center gap-2">
            <RouterLink
              to="/login"
              class="text-xs font-semibold text-stone-700 hover:text-kitchen-800 px-3 py-1.5"
            >
              Log in
            </RouterLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          >
            <MenuIcon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1">
      <RouterLink
        to="/menu"
        @click="mobileMenuOpen = false"
        class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-cream-100"
      >
        Menu Catalog
      </RouterLink>
      <RouterLink
        to="/order"
        @click="mobileMenuOpen = false"
        class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-cream-100"
      >
        Place Pre-Order ({{ cartStore.itemCount }} items)
      </RouterLink>
      <RouterLink
        to="/my-orders"
        @click="mobileMenuOpen = false"
        class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-cream-100"
      >
        My Orders
      </RouterLink>
      <div class="border-t border-stone-200 pt-2 my-2 font-semibold text-xs text-stone-600 uppercase tracking-wider">
        Kitchen Operations
      </div>
      <RouterLink
        to="/admin/daily-board"
        @click="mobileMenuOpen = false"
        class="block px-3 py-2 rounded-md text-base font-bold text-kitchen-800 bg-kitchen-50"
      >
        Daily Order Board
      </RouterLink>
      <RouterLink
        to="/admin/dashboard"
        @click="mobileMenuOpen = false"
        class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-cream-100"
      >
        Admin Dashboard
      </RouterLink>
      <RouterLink
        to="/admin/menu-management"
        @click="mobileMenuOpen = false"
        class="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:bg-cream-100"
      >
        Menu Management
      </RouterLink>
      <div class="pt-3 border-t border-stone-200 flex items-center justify-between">
        <button
          @click="toggleRole"
          class="text-xs px-3 py-1.5 rounded-lg border bg-stone-50 font-semibold"
        >
          Toggle Role: {{ authStore.isAdmin ? 'Admin' : 'Customer' }}
        </button>
        <button
          @click="handleLogout"
          class="text-xs text-rose-600 font-semibold"
        >
          Logout
        </button>
      </div>
    </div>
  </header>
</template>
