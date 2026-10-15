import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MenuItem, CartItem } from '@/types';

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([]);

  const itemCount = computed(() =>
    items.value.reduce((total, item) => total + item.quantity, 0)
  );

  const subtotal = computed(() =>
    items.value.reduce((total, item) => total + item.menuItem.price * item.quantity, 0)
  );

  function addItem(menuItem: MenuItem, quantity = 1) {
    const existing = items.value.find((i) => i.menuItem.id === menuItem.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.value.push({ menuItem, quantity });
    }
  }

  function removeItem(menuItemId: string) {
    items.value = items.value.filter((i) => i.menuItem.id !== menuItemId);
  }

  function updateQuantity(menuItemId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    const item = items.value.find((i) => i.menuItem.id === menuItemId);
    if (item) {
      item.quantity = quantity;
    }
  }

  function clearCart() {
    items.value = [];
  }

  return {
    items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
});
