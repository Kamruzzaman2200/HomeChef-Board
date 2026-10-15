import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { MenuItem } from '@/types';
import { api } from '@/services/api';

export const useMenuStore = defineStore('menu', () => {
  const items = ref<MenuItem[]>([]);
  const loading = ref(false);
  const selectedCategory = ref<string>('All');
  const searchQuery = ref<string>('');

  const categories = computed(() => {
    const list = new Set<string>();
    items.value.forEach((item) => list.add(item.category));
    return ['All', ...Array.from(list)];
  });

  const availableItems = computed(() => {
    return items.value.filter((i) => i.available && !i.isArchived);
  });

  const filteredItems = computed(() => {
    return items.value.filter((item) => {
      const matchCat =
        selectedCategory.value === 'All' || item.category === selectedCategory.value;
      const matchSearch =
        !searchQuery.value ||
        item.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
      return matchCat && matchSearch && !item.isArchived;
    });
  });

  async function loadMenu() {
    loading.value = true;
    try {
      items.value = await api.getMenuItems();
    } finally {
      loading.value = false;
    }
  }

  async function addItem(newItem: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) {
    const created = await api.createMenuItem(newItem);
    items.value.unshift(created);
    return created;
  }

  async function updateItem(id: string, updates: Partial<MenuItem>) {
    const updated = await api.updateMenuItem(id, updates);
    const index = items.value.findIndex((i) => i.id === id);
    if (index !== -1) {
      items.value[index] = updated;
    }
    return updated;
  }

  async function toggleAvailability(id: string) {
    const item = items.value.find((i) => i.id === id);
    if (item) {
      return await updateItem(id, { available: !item.available });
    }
  }

  async function removeItem(id: string) {
    await api.deleteMenuItem(id);
    items.value = items.value.filter((i) => i.id !== id);
  }

  return {
    items,
    loading,
    selectedCategory,
    searchQuery,
    categories,
    availableItems,
    filteredItems,
    loadMenu,
    addItem,
    updateItem,
    toggleAvailability,
    removeItem,
  };
});
