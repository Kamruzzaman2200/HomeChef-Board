<script setup lang="ts">
import { computed, ref } from 'vue';
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
  X as CloseIcon,
  Store,
  LineChart,
  BookOpen,
} from 'lucide-vue-next';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const cartStore = useCartStore();

const mobileMenuOpen = ref(false);

const activePath = computed(() => route.path);

async function toggleRole() {
  if (authStore.isAdmin) {
    await authStore.switchRole('CUSTOMER');
    router.push('/menu');
  } else {
    await authStore.switchRole('ADMIN');
    router.push('/admin/daily-board');
  }
}

async function handleLogout() {
  await authStore.logout();
  router.push('/login');
}
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200/80 shadow-2xs">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        
        <!-- Brand / Logo -->
        <div class="flex items-center gap-3">
          <RouterLink
            :to="authStore.isAdmin ? '/admin/daily-board' : '/'"
            class="flex items-center gap-2.5 group"
          >
            <div class="w-10 h-10 rounded-xl bg-kitchen-800 text-white flex items-center justify-center shadow-md group-hover:bg-kitchen-700 transition-colors">
              <ChefHat class="w-5 h-5 text-kitchen-200" />
            </div>
            <div>
              <span class="font-extrabold text-lg text-stone-900 tracking-tight block leading-tight">
                HomeChef <span class="text-kitchen-700">Board</span>
              </span>
              <span class="text-[10px] uppercase tracking-widest text-stone-600 font-semibold block">
                {{ authStore.isAdmin ? 'Chef Preparation Console' : 'Kitchen Pre-Order System' }}
              </span>
            </div>
          </RouterLink>
        </div>

        <!-- Desktop Navigation: Role-Aware -->
        <nav class="hidden md:flex items-center gap-1.5 lg:gap-2">
          
          <!-- ADMIN (Chef) Navigation -->
          <template v-if="authStore.isAdmin">
            <RouterLink
              to="/admin/daily-board"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-1.5',
                activePath === '/admin/daily-board'
                  ? 'bg-kitchen-800 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              ]"
            >
              <LayoutDashboard class="w-4 h-4" />
              <span>Daily Prep Board</span>
            </RouterLink>

            <RouterLink
              to="/admin/dashboard"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-1.5',
                activePath === '/admin/dashboard'
                  ? 'bg-kitchen-800 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              ]"
            >
              <LineChart class="w-4 h-4" />
              <span>Analytics</span>
            </RouterLink>

            <RouterLink
              to="/admin/menu-management"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors inline-flex items-center gap-1.5',
                activePath === '/admin/menu-management'
                  ? 'bg-kitchen-800 text-white shadow-xs'
                  : 'text-stone-700 hover:bg-stone-100'
              ]"
            >
              <BookOpen class="w-4 h-4" />
              <span>Manage Menu</span>
            </RouterLink>

            <div class="h-4 w-px bg-stone-200 mx-1" />

            <RouterLink
              to="/menu"
              class="px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-500 hover:text-stone-800 hover:bg-stone-50 inline-flex items-center gap-1"
              title="Preview public storefront"
            >
              <Store class="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </RouterLink>
          </template>

          <!-- CUSTOMER Navigation -->
          <template v-else>
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
              <span>Menu</span>
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
              <span>Place Pre-Order</span>
            </RouterLink>

            <RouterLink
              v-if="authStore.isAuthenticated"
              to="/my-orders"
              :class="[
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-1.5',
                activePath === '/my-orders'
                  ? 'bg-kitchen-50 text-kitchen-800 font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
              ]"
            >
              <ClipboardList class="w-4 h-4" />
              <span>My Orders</span>
            </RouterLink>
          </template>
        </nav>

        <!-- Right Side Controls -->
        <div class="flex items-center gap-3">
          
          <!-- Role Switcher Pill -->
          <button
            @click="toggleRole"
            type="button"
            title="Click to toggle between Chef Admin view and Customer view"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-2xs hover:scale-102"
            :class="authStore.isAdmin 
              ? 'bg-kitchen-100 border-kitchen-300 text-kitchen-900 hover:bg-kitchen-200' 
              : 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'"
          >
            <UserCheck class="w-3.5 h-3.5 text-stone-700" />
            <span>Mode: {{ authStore.isAdmin ? 'Chef Admin' : 'Customer' }}</span>
            <span class="text-[10px] underline opacity-75 font-normal ml-0.5">Switch</span>
          </button>

          <!-- Pre-order Cart Icon -->
          <RouterLink
            to="/order"
            class="relative p-2 text-stone-700 hover:text-kitchen-800 hover:bg-stone-100 rounded-lg transition-colors"
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

          <!-- User Info / Auth State -->
          <div v-if="authStore.isAuthenticated" class="hidden sm:flex items-center gap-2 pl-2 border-l border-stone-200">
            <div class="text-right">
              <span class="block text-xs font-bold text-stone-900 leading-tight">
                {{ authStore.currentUser?.name }}
              </span>
              <span class="inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider"
                :class="authStore.isAdmin ? 'bg-kitchen-100 text-kitchen-800' : 'bg-amber-100 text-amber-800'"
              >
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

          <!-- Logged Out Actions -->
          <div v-else class="hidden sm:flex items-center gap-2">
            <RouterLink
              to="/login"
              class="text-xs font-bold text-stone-700 hover:text-kitchen-800 px-2.5 py-1.5 rounded-lg hover:bg-stone-100"
            >
              Sign In
            </RouterLink>
            <RouterLink
              to="/register"
              class="text-xs font-bold text-white bg-kitchen-800 hover:bg-kitchen-900 px-3 py-1.5 rounded-lg shadow-2xs"
            >
              Register
            </RouterLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100"
          >
            <CloseIcon v-if="mobileMenuOpen" class="w-5 h-5" />
            <MenuIcon v-else class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Navigation -->
    <div v-if="mobileMenuOpen" class="md:hidden border-t border-stone-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
      
      <!-- Admin Mobile Links -->
      <template v-if="authStore.isAdmin">
        <div class="px-2 py-1 text-[11px] font-bold text-kitchen-800 uppercase tracking-wider">
          Chef Operations
        </div>
        <RouterLink
          to="/admin/daily-board"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-sm font-bold text-kitchen-800 bg-kitchen-50"
        >
          Daily Prep Board
        </RouterLink>
        <RouterLink
          to="/admin/dashboard"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Kitchen Analytics
        </RouterLink>
        <RouterLink
          to="/admin/menu-management"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Manage Menu
        </RouterLink>
        <RouterLink
          to="/menu"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-sm font-medium text-stone-500 hover:bg-stone-50"
        >
          View Storefront
        </RouterLink>
      </template>

      <!-- Customer Mobile Links -->
      <template v-else>
        <RouterLink
          to="/menu"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Menu Catalog
        </RouterLink>
        <RouterLink
          to="/order"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Place Pre-Order ({{ cartStore.itemCount }} items)
        </RouterLink>
        <RouterLink
          v-if="authStore.isAuthenticated"
          to="/my-orders"
          @click="mobileMenuOpen = false"
          class="block px-3 py-2 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          My Orders
        </RouterLink>
      </template>

      <!-- Mobile Footer Action Controls -->
      <div class="pt-3 border-t border-stone-200 space-y-2">
        <button
          @click="toggleRole(); mobileMenuOpen = false"
          class="w-full text-xs py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5"
          :class="authStore.isAdmin ? 'bg-amber-50 text-amber-900 border-amber-300' : 'bg-kitchen-50 text-kitchen-900 border-kitchen-300'"
        >
          <UserCheck class="w-3.5 h-3.5" />
          <span>Switch to {{ authStore.isAdmin ? 'Customer' : 'Chef Admin' }} Mode</span>
        </button>

        <div v-if="authStore.isAuthenticated" class="flex items-center justify-between px-2 pt-1">
          <span class="text-xs font-semibold text-stone-700">{{ authStore.currentUser?.name }}</span>
          <button
            @click="handleLogout(); mobileMenuOpen = false"
            class="text-xs text-rose-600 font-bold hover:underline"
          >
            Sign Out
          </button>
        </div>

        <div v-else class="grid grid-cols-2 gap-2 pt-1">
          <RouterLink
            to="/login"
            @click="mobileMenuOpen = false"
            class="text-center text-xs py-2 rounded-lg border border-stone-300 font-bold text-stone-700 hover:bg-stone-50"
          >
            Sign In
          </RouterLink>
          <RouterLink
            to="/register"
            @click="mobileMenuOpen = false"
            class="text-center text-xs py-2 rounded-lg bg-kitchen-800 text-white font-bold shadow-xs hover:bg-kitchen-900"
          >
            Register
          </RouterLink>
        </div>
      </div>
    </div>
  </header>
</template>
