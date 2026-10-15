import { MenuItem, Order, OrderStatus, CreateOrderPayload, DashboardStats, User } from '@/types';
import { mockMenuItems, mockOrders, mockUsers } from './mockData';

// Local storage keys for mock persistence
const STORAGE_KEYS = {
  MENU: 'homechef_menu_items',
  ORDERS: 'homechef_orders',
  USER: 'homechef_current_user',
};

// Initialize localStorage with mock data if not already present
function initLocalStorage() {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(mockMenuItems));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    // Default to the admin for easy previewing of kitchen dashboard
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUsers[0]));
  }
}

initLocalStorage();

function getStoredMenu(): MenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU);
    return raw ? JSON.parse(raw) : mockMenuItems;
  } catch {
    return mockMenuItems;
  }
}

function setStoredMenu(items: MenuItem[]) {
  localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
}

function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    return raw ? JSON.parse(raw) : mockOrders;
  } catch {
    return mockOrders;
  }
}

function setStoredOrders(orders: Order[]) {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

// API Service Interface with fallback
export const api = {
  // Menu APIs
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const res = await fetch('/api/menu');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback to mock
    }
    return getStoredMenu();
  },

  async createMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const current = getStoredMenu();
    const newItem: MenuItem = {
      ...item,
      id: `m-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    current.unshift(newItem);
    setStoredMenu(current);
    return newItem;
  },

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const current = getStoredMenu();
    const index = current.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Menu item not found');
    current[index] = { ...current[index], ...updates, updatedAt: new Date().toISOString() };
    setStoredMenu(current);
    return current[index];
  },

  async deleteMenuItem(id: string): Promise<void> {
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) return;
    } catch {
      // fallback
    }
    const current = getStoredMenu().filter((i) => i.id !== id);
    setStoredMenu(current);
  },

  // Order APIs
  async getOrders(params?: { status?: string; date?: string; customerId?: string }): Promise<Order[]> {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`/api/orders?${query}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    let orders = getStoredOrders();
    if (params?.status) {
      orders = orders.filter((o) => o.status === params.status);
    }
    if (params?.customerId) {
      orders = orders.filter((o) => o.userId === params.customerId);
    }
    return orders;
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const orders = getStoredOrders();
    return orders.find((o) => o.id === id) || null;
  },

  async createOrder(payload: CreateOrderPayload, user: User): Promise<Order> {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const menu = getStoredMenu();
    let total = 0;
    const orderItems = payload.items.map((item) => {
      const menuItem = menu.find((m) => m.id === item.menuItemId);
      const unitPrice = menuItem ? menuItem.price : 10;
      const itemNameSnapshot = menuItem ? menuItem.name : 'Custom Kitchen Item';
      total += unitPrice * item.quantity;
      return {
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        menuItemId: item.menuItemId,
        itemNameSnapshot,
        quantity: item.quantity,
        unitPrice,
        menuItem,
      };
    });

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user.id,
      user,
      orderDate: new Date().toISOString(),
      fulfillDate: payload.fulfillDate,
      fulfillTime: payload.fulfillTime,
      fulfillType: payload.fulfillType,
      addressNote: payload.addressNote || '',
      status: 'REQUESTED',
      total,
      notes: payload.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: orderItems,
    };

    const orders = getStoredOrders();
    orders.unshift(newOrder);
    setStoredOrders(orders);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');
    orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
    setStoredOrders(orders);
    return orders[index];
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch('/api/dashboard/summary');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const orders = getStoredOrders();
    const stats: DashboardStats = {
      requestedCount: orders.filter((o) => o.status === 'REQUESTED').length,
      confirmedCount: orders.filter((o) => o.status === 'CONFIRMED').length,
      preparingCount: orders.filter((o) => o.status === 'PREPARING').length,
      readyCount: orders.filter((o) => o.status === 'READY').length,
      completedCount: orders.filter((o) => o.status === 'COMPLETED').length,
      todayRevenue: orders
        .filter((o) => o.status !== 'CANCELLED')
        .reduce((sum, o) => sum + Number(o.total), 0),
      totalOrdersCount: orders.length,
    };
    return stats;
  },
};
