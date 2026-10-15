<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Card from '@/components/ui/Card.vue';
import { ChefHat, UserPlus } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();

const name = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const role = ref<'CUSTOMER' | 'ADMIN'>('CUSTOMER');
const loading = ref(false);

async function handleRegister() {
  loading.value = true;
  try {
    const user = await authStore.register(name.value, email.value, phone.value, role.value);
    if (user.role === 'ADMIN') {
      router.push('/admin/daily-board');
    } else {
      router.push('/menu');
    }
  } finally {
    loading.value = false;
  }
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
        <h2 class="text-2xl font-extrabold text-stone-900 tracking-tight">Create an Account</h2>
        <p class="text-xs text-stone-600">Join our kitchen customer community or manage preparation batches</p>
      </div>

      <!-- Form Card -->
      <Card>
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Full Name</label>
            <Input v-model="name" placeholder="David Miller" required />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
            <Input v-model="email" type="email" placeholder="name@example.com" required />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Phone Number</label>
            <Input v-model="phone" type="tel" placeholder="+1 (555) 000-0000" />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Password</label>
            <Input v-model="password" type="password" placeholder="••••••••" required />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Account Type</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                @click="role = 'CUSTOMER'"
                :class="[
                  'py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer',
                  role === 'CUSTOMER' ? 'bg-kitchen-800 text-white border-kitchen-800' : 'bg-stone-50 text-stone-700 border-stone-200'
                ]"
              >
                Customer (Pre-orders)
              </button>
              <button
                type="button"
                @click="role = 'ADMIN'"
                :class="[
                  'py-2 px-3 rounded-lg text-xs font-bold border transition-colors cursor-pointer',
                  role === 'ADMIN' ? 'bg-kitchen-800 text-white border-kitchen-800' : 'bg-stone-50 text-stone-700 border-stone-200'
                ]"
              >
                Kitchen Chef / Admin
              </button>
            </div>
          </div>

          <div class="pt-2">
            <Button type="submit" variant="default" size="lg" class="w-full font-bold shadow-md" :disabled="loading">
              <UserPlus class="w-4 h-4" />
              <span>{{ loading ? 'Creating Account...' : 'Register' }}</span>
            </Button>
          </div>
        </form>

        <div class="mt-4 pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          Already have an account?
          <RouterLink to="/login" class="text-kitchen-800 font-bold hover:underline ml-1">
            Sign In
          </RouterLink>
        </div>
      </Card>
    </div>
  </div>
</template>
