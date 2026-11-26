import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User, Role } from '@/types';
import { mockUsers } from '@/services/mockData';
import { api } from '@/services/api';

function getInitialUser(): User | null {
  try {
    if (typeof window === 'undefined') return mockUsers[0];
    if (localStorage.getItem('homechef_logged_out') === 'true') {
      return null;
    }
    const stored = localStorage.getItem('homechef_current_user');
    if (stored) return JSON.parse(stored);
    return mockUsers[0]; // Default to Chef Admin for first-time previewers
  } catch {
    return null;
  }
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(getInitialUser());

  const isAuthenticated = computed(() => !!currentUser.value);
  const isAdmin = computed(() => currentUser.value?.role === 'ADMIN');
  const isCustomer = computed(() => currentUser.value?.role === 'CUSTOMER');

  function setUser(user: User | null) {
    currentUser.value = user;
    if (user) {
      localStorage.setItem('homechef_current_user', JSON.stringify(user));
      localStorage.removeItem('homechef_logged_out');
    } else {
      localStorage.removeItem('homechef_current_user');
      localStorage.setItem('homechef_logged_out', 'true');
    }
  }

  async function switchRole(role: Role) {
    const targetUser = role === 'ADMIN' ? mockUsers[0] : mockUsers[1];
    setUser(targetUser);
    try {
      await api.demoSwitch(role);
    } catch {
      // background sync
    }
    return targetUser;
  }

  async function login(email: string, password?: string) {
    const user = await api.login(email, password);
    setUser(user);
    return user;
  }

  async function register(name: string, email: string, phone: string, role: Role = 'CUSTOMER', password?: string) {
    const user = await api.register({ name, email, phone, role, password });
    setUser(user);
    return user;
  }

  async function logout() {
    await api.logout();
    setUser(null);
  }

  return {
    currentUser,
    isAuthenticated,
    isAdmin,
    isCustomer,
    setUser,
    switchRole,
    login,
    register,
    logout,
  };
});
