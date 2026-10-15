<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useMenuStore } from '@/stores/menu';
import { MenuItem } from '@/types';
import Button from '@/components/ui/Button.vue';
import Input from '@/components/ui/Input.vue';
import Card from '@/components/ui/Card.vue';
import Modal from '@/components/ui/Modal.vue';
import Badge from '@/components/ui/Badge.vue';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  UtensilsCrossed,
  ShieldCheck,
} from 'lucide-vue-next';

const menuStore = useMenuStore();

const search = ref('');
const selectedCategory = ref('All');

// Modal State
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const form = ref({
  name: '',
  description: '',
  category: 'Mains',
  price: 15.00,
  image: '',
  available: true,
});

onMounted(async () => {
  await menuStore.loadMenu();
});

const filteredList = computed(() => {
  return menuStore.items.filter((item) => {
    const matchCat = selectedCategory.value === 'All' || item.category === selectedCategory.value;
    const matchSearch =
      !search.value ||
      item.name.toLowerCase().includes(search.value.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(search.value.toLowerCase()));
    return matchCat && matchSearch;
  });
});

function openAddModal() {
  isEditing.value = false;
  editingId.value = null;
  form.value = {
    name: '',
    description: '',
    category: 'Mains',
    price: 15.00,
    image: '',
    available: true,
  };
  isModalOpen.value = true;
}

function openEditModal(item: MenuItem) {
  isEditing.value = true;
  editingId.value = item.id;
  form.value = {
    name: item.name,
    description: item.description || '',
    category: item.category,
    price: Number(item.price),
    image: item.image || '',
    available: item.available,
  };
  isModalOpen.value = true;
}

async function handleSaveItem() {
  if (!form.value.name.trim()) return;

  if (isEditing.value && editingId.value) {
    await menuStore.updateItem(editingId.value, {
      name: form.value.name,
      description: form.value.description,
      category: form.value.category,
      price: Number(form.value.price),
      image: form.value.image,
      available: form.value.available,
    });
  } else {
    await menuStore.addItem({
      name: form.value.name,
      description: form.value.description,
      category: form.value.category,
      price: Number(form.value.price),
      image: form.value.image,
      available: form.value.available,
    });
  }
  isModalOpen.value = false;
}

async function handleToggle(id: string) {
  await menuStore.toggleAvailability(id);
}

async function handleDelete(id: string) {
  if (confirm('Are you sure you want to remove this menu item? Historical order receipts will preserve the item snapshot.')) {
    await menuStore.removeItem(id);
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
      <div>
        <span class="text-xs font-bold text-kitchen-700 uppercase tracking-wider">Catalog &amp; Inventory</span>
        <h1 class="text-3xl font-extrabold text-stone-900 tracking-tight mt-1">Menu Management</h1>
        <p class="text-sm text-stone-600 mt-1">
          Add new batch recipes, adjust prices, and toggle daily availability.
        </p>
      </div>

      <Button variant="default" size="md" @click="openAddModal">
        <Plus class="w-4 h-4" />
        <span>Add Dish</span>
      </Button>
    </div>

    <!-- Preservation Notice Banner -->
    <div class="p-3 bg-stone-100/90 rounded-xl border border-stone-200/80 text-xs text-stone-700 flex items-center gap-2">
      <ShieldCheck class="w-4 h-4 text-kitchen-800 shrink-0" />
      <span>
        <strong>Historical Integrity Guarantee:</strong> Disabling or updating items never alters past customer order receipts or amounts.
      </span>
    </div>

    <!-- Filters Bar -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-2xs">
      <div class="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
        <button
          v-for="cat in menuStore.categories"
          :key="cat"
          @click="selectedCategory = cat"
          :class="[
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer',
            selectedCategory === cat ? 'bg-kitchen-800 text-white' : 'text-stone-600 hover:bg-stone-100'
          ]"
        >
          {{ cat }}
        </button>
      </div>

      <div class="relative w-full sm:w-64">
        <Search class="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        <input
          v-model="search"
          type="text"
          placeholder="Filter menu items..."
          class="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-kitchen-600"
        />
      </div>
    </div>

    <!-- Items Table -->
    <Card :padding="false">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider bg-cream-50/50">
              <th class="py-3 px-4">Item</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Price</th>
              <th class="py-3 px-4 text-center">Live Status</th>
              <th class="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-stone-100">
            <tr
              v-for="item in filteredList"
              :key="item.id"
              class="hover:bg-cream-50/40 transition-colors"
            >
              <!-- Thumbnail & Name -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <img
                    v-if="item.image"
                    :src="item.image"
                    :alt="item.name"
                    class="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div
                    v-else
                    class="w-10 h-10 rounded-lg bg-cream-200 border border-stone-200 flex items-center justify-center text-stone-400 shrink-0"
                  >
                    <UtensilsCrossed class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="font-bold text-stone-900 block">{{ item.name }}</span>
                    <span class="text-[11px] text-stone-600 line-clamp-1 max-w-md">
                      {{ item.description || 'No description provided.' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Category -->
              <td class="py-3 px-4">
                <Badge variant="kitchen">{{ item.category }}</Badge>
              </td>

              <!-- Price -->
              <td class="py-3 px-4 font-bold text-stone-900 text-sm">
                ${{ Number(item.price).toFixed(2) }}
              </td>

              <!-- Availability Toggle -->
              <td class="py-3 px-4 text-center">
                <button
                  @click="handleToggle(item.id)"
                  :class="[
                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer shadow-2xs',
                    item.available
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 hover:bg-emerald-200'
                      : 'bg-stone-200 text-stone-700 border border-stone-300 hover:bg-stone-300'
                  ]"
                >
                  <CheckCircle v-if="item.available" class="w-3.5 h-3.5 text-emerald-700" />
                  <XCircle v-else class="w-3.5 h-3.5 text-stone-600" />
                  <span>{{ item.available ? 'Available' : 'Sold Out' }}</span>
                </button>
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button
                    @click="openEditModal(item)"
                    class="p-1.5 rounded-lg text-stone-600 hover:text-kitchen-800 hover:bg-stone-100 transition-colors cursor-pointer"
                    title="Edit dish"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click="handleDelete(item.id)"
                    class="p-1.5 rounded-lg text-stone-600 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete dish"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>

    <!-- Add / Edit Modal -->
    <Modal
      :is-open="isModalOpen"
      :title="isEditing ? 'Edit Dish Details' : 'Add New Kitchen Dish'"
      max-width="lg"
      @close="isModalOpen = false"
    >
      <form @submit.prevent="handleSaveItem" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Dish Name *</label>
          <Input v-model="form.name" placeholder="e.g. Garlic Confit Focaccia" required />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Category</label>
            <select
              v-model="form.category"
              class="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-kitchen-600 shadow-sm"
            >
              <option value="Mains">Mains</option>
              <option value="Bakery">Bakery</option>
              <option value="Starters">Starters</option>
              <option value="Desserts">Desserts</option>
              <option value="Family Packs">Family Packs</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Price ($) *</label>
            <Input v-model.number="form.price" type="number" step="0.5" required />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Image URL</label>
          <Input v-model="form.image" placeholder="https://images.unsplash.com/..." />
        </div>

        <div>
          <label class="block text-xs font-bold text-stone-700 mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Ingredients, prep notes, allergens..."
            class="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-kitchen-600 shadow-sm"
          ></textarea>
        </div>

        <div class="flex items-center gap-2 pt-1">
          <input
            id="avail-check"
            type="checkbox"
            v-model="form.available"
            class="w-4 h-4 text-kitchen-800 rounded border-stone-300 focus:ring-kitchen-600"
          />
          <label for="avail-check" class="text-xs font-semibold text-stone-800 select-none">
            Immediately available for customer pre-order
          </label>
        </div>

        <div class="pt-4 flex justify-end gap-2 border-t border-stone-100">
          <Button type="button" variant="ghost" @click="isModalOpen = false">
            Cancel
          </Button>
          <Button type="submit" variant="default">
            {{ isEditing ? 'Save Changes' : 'Create Dish' }}
          </Button>
        </div>
      </form>
    </Modal>
  </div>
</template>
