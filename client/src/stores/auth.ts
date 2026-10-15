import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { User, Role } from '@/types';
import { mockUsers } from '@/services/mockData';

function getInitialUser(): User | null {
  try {
    const stored = localStorage.getItem('homechef_current_user');
    return stored ? JSON.parse(stored) : mockUsers[0]; // Default to Chef Admin
  } catch {
    return mockUsers[0];
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
    } else {
      localStorage.removeItem('homechef_current_user');
    }
  }

  function switchRole(role: Role) {
    if (role === 'ADMIN') {
      setUser(mockUsers[0]);
    } else {
      setUser(mockUsers[1]);
    }
  }

  async function login(email: string, _password?: string) {
    // Check against mock or backend
    const found = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      return found;
    }
    // Create new temporary session user
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: email.includes('admin') || email.includes('chef') ? 'ADMIN' : 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  }

  async function register(name: string, email: string, phone: string, role: Role = 'CUSTOMER') {
    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      phone,
      role,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    return newUser;
  }

  function logout() {
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
