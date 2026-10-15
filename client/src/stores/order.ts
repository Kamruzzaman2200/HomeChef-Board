import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { Order, OrderStatus, CreateOrderPayload, DashboardStats, User } from '@/types';
import { api } from '@/services/api';

export const useOrderStore = defineStore('orders', () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const activeOrder = ref<Order | null>(null);
  const selectedDate = ref<string>('');
  const statusFilter = ref<string>('ALL');

  const filteredOrders = computed(() => {
    return orders.value.filter((order) => {
      const matchStatus = statusFilter.value === 'ALL' || order.status === statusFilter.value;
      const matchDate = !selectedDate.value || (order.fulfillDate && order.fulfillDate.startsWith(selectedDate.value));
      return matchStatus && matchDate;
    });
  });

  const ordersByStatus = computed(() => {
    const map: Record<OrderStatus, Order[]> = {
      REQUESTED: [],
      CONFIRMED: [],
      PREPARING: [],
      READY: [],
      COMPLETED: [],
      CANCELLED: [],
    };
    for (const order of filteredOrders.value) {
      if (map[order.status]) {
        map[order.status].push(order);
      }
    }
    return map;
  });

  async function loadOrders(customerId?: string) {
    loading.value = true;
    try {
      orders.value = await api.getOrders(customerId ? { customerId } : undefined);
    } finally {
      loading.value = false;
    }
  }

  async function getOrder(id: string): Promise<Order | null> {
    loading.value = true;
    try {
      const found = await api.getOrderById(id);
      activeOrder.value = found;
      return found;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(id: string, status: OrderStatus) {
    const updated = await api.updateOrderStatus(id, status);
    const index = orders.value.findIndex((o) => o.id === id);
    if (index !== -1) {
      orders.value[index] = updated;
    }
    if (activeOrder.value?.id === id) {
      activeOrder.value = updated;
    }
    return updated;
  }

  async function placeOrder(payload: CreateOrderPayload, user: User) {
    loading.value = true;
    try {
      const newOrder = await api.createOrder(payload, user);
      orders.value.unshift(newOrder);
      return newOrder;
    } finally {
      loading.value = false;
    }
  }

  async function getStats(): Promise<DashboardStats> {
    return await api.getDashboardStats();
  }

  return {
    orders,
    loading,
    activeOrder,
    selectedDate,
    statusFilter,
    filteredOrders,
    ordersByStatus,
    loadOrders,
    getOrder,
    updateStatus,
    placeOrder,
    getStats,
  };
});
