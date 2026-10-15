<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Card from '@/components/ui/Card.vue';
import { ChefHat, ShieldCheck, User } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('chef@homechef.local');
const password = ref('password123');
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  try {
    const user = await authStore.login(email.value, password.value);
    if (user.role === 'ADMIN') {
      router.push('/admin/daily-board');
    } else {
      router.push('/my-orders');
    }
  } finally {
    loading.value = false;
  }
}

function quickLoginAdmin() {
  email.value = 'chef@homechef.local';
  handleLogin();
}

function quickLoginCustomer() {
  email.value = 'david.miller@gmail.com';
  handleLogin();
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-6">
      
      <!-- Brand Heading -->
      <div class="text-center space-y-2">
        <div class="w-12 h-12 rounded-2xl bg-kitchen-800 text-white flex items-center justify-center mx-auto shadow-md">
          <ChefHat class="w-6 h-6 text-kitchen-200" />
        </div>
        <h2 class="text-2xl font-extrabold text-stone-900 tracking-tight">Sign in to HomeChef Board</h2>
        <p class="text-xs text-stone-600">Access kitchen preparation tickets or manage your pre-orders</p>
      </div>

      <!-- Quick Demo Credentials Box -->
      <div class="bg-kitchen-50 border border-kitchen-200 rounded-xl p-3 text-xs text-stone-700 space-y-2">
        <span class="font-bold text-kitchen-900 block uppercase tracking-wider text-[10px]">
          Quick Demo Accounts
        </span>
        <div class="grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="quickLoginAdmin"
            class="p-2 rounded-lg bg-white border border-kitchen-300 hover:bg-kitchen-100/70 text-left transition-colors cursor-pointer"
          >
            <div class="font-bold text-kitchen-900 flex items-center gap-1">
              <ChefHat class="w-3.5 h-3.5 text-kitchen-800" />
              <span>Chef Admin</span>
            </div>
            <div class="text-[10px] text-stone-600 truncate">chef@homechef.local</div>
          </button>

          <button
            type="button"
            @click="quickLoginCustomer"
            class="p-2 rounded-lg bg-white border border-stone-300 hover:bg-stone-50 text-left transition-colors cursor-pointer"
          >
            <div class="font-bold text-stone-900 flex items-center gap-1">
              <User class="w-3.5 h-3.5 text-stone-600" />
              <span>Customer</span>
            </div>
            <div class="text-[10px] text-stone-600 truncate">david.miller@gmail.com</div>
          </button>
        </div>
      </div>

      <!-- Form Card -->
      <Card>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <Input v-model="email" type="email" placeholder="name@example.com" required />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <Input v-model="password" type="password" placeholder="••••••••" required />
          </div>

          <div class="pt-2">
            <Button type="submit" variant="default" size="lg" class="w-full font-bold shadow-md" :disabled="loading">
              <ShieldCheck class="w-4 h-4" />
              <span>{{ loading ? 'Signing in...' : 'Sign In' }}</span>
            </Button>
          </div>
        </form>

        <div class="mt-4 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          Don't have an account?
          <RouterLink to="/register" class="text-kitchen-800 font-bold hover:underline ml-1">
            Create an account
          </RouterLink>
        </div>
      </Card>
    </div>
  </div>
</template>
