import { MenuItem, Order, OrderStatus, CreateOrderPayload, DashboardStats, User, Role } from '@/types';
import { mockMenuItems, mockOrders, mockUsers } from './mockData';

// Local storage keys for mock persistence
const STORAGE_KEYS = {
  MENU: 'homechef_menu_items',
  ORDERS: 'homechef_orders',
  USER: 'homechef_current_user',
  DATA_VERSION: 'homechef_data_version',
};

const CURRENT_DATA_VERSION = 'v5_bdt_fixed_pricing';

// Auto-sanitize menu items to heal any stale broken image links or USD prices in localStorage
function sanitizeMenu(items: MenuItem[]): MenuItem[] {
  let changed = false;
  const imageByName: Record<string, string> = {
    'artisan sourdough boule': '/images/sourdough.jpg',
    'braised beef short ribs': '/images/short-ribs.jpg',
    'wild mushroom & truffle lasagna': '/images/lasagna.jpg',
    'lemon rosemary roasted chicken': '/images/roasted-chicken.jpg',
    'burrata & heirloom tomato tart': '/images/burrata-tart.jpg',
    'basque burnt cheesecake': '/images/cheesecake.jpg',
    'cardamom pistachio babka': '/images/babka.jpg',
    'weekend feast family pack': '/images/family-pack.jpg',
  };
  const priceByName: Record<string, number> = {
    'artisan sourdough boule': 450,
    'braised beef short ribs': 1450,
    'wild mushroom & truffle lasagna': 950,
    'lemon rosemary roasted chicken': 1150,
    'burrata & heirloom tomato tart': 650,
    'basque burnt cheesecake': 450,
    'cardamom pistachio babka': 550,
    'weekend feast family pack': 3850,
  };

  const sanitized = items.map((item) => {
    let itemChanged = false;
    let newImg = item.image;
    let newPrice = Number(item.price);
    const key = (item.name || '').trim().toLowerCase();

    if (imageByName[key] && (!item.image || item.image.includes('unsplash.com'))) {
      newImg = imageByName[key];
      itemChanged = true;
    }
    if (newPrice < 100) {
      if (priceByName[key]) {
        newPrice = priceByName[key];
      } else {
        newPrice = Math.round(newPrice * 110);
      }
      itemChanged = true;
    }

    if (itemChanged) {
      changed = true;
      return { ...item, image: newImg, price: newPrice };
    }
    return item;
  });

  if (changed && typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(sanitized));
    } catch {
      // ignore
    }
  }
  return sanitized;
}

// Initialize localStorage with mock data if not already present
function initLocalStorage() {
  if (typeof window === 'undefined') return;

  const currentVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);
  if (currentVersion !== CURRENT_DATA_VERSION) {
    // Reset to fresh BDT pricing and bundled local assets
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(mockMenuItems));
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
  } else {
    const storedMenu = localStorage.getItem(STORAGE_KEYS.MENU);
    if (!storedMenu) {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(mockMenuItems));
    } else {
      try {
        const parsed = JSON.parse(storedMenu);
        sanitizeMenu(parsed);
      } catch {
        localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(mockMenuItems));
      }
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mockOrders));
    }
  }

  if (!localStorage.getItem(STORAGE_KEYS.USER)) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mockUsers[0]));
  }
}

initLocalStorage();

function getStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getStoredMenu(): MenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU);
    return sanitizeMenu(raw ? JSON.parse(raw) : mockMenuItems);
  } catch {
    return sanitizeMenu(mockMenuItems);
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

function getAuthHeaders(): HeadersInit {
  const user = getStoredUser();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (user) {
    headers['x-demo-user-id'] = user.id;
    headers['x-demo-user-role'] = user.role;
  }
  return headers;
}

// API Service Interface with dual-mode server & mock fallback
export const api = {
  // ==========================================
  // Auth APIs
  // ==========================================
  async login(email: string, password?: string): Promise<User> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim(), password: password || 'password123' }),
      });
      if (res.ok) {
        return await res.json();
      }
      const data = await res.json().catch(() => null);
      // Only throw if user explicitly entered wrong credentials on a working database
      if (data?.error && data.error === 'Invalid email or password') {
        throw new Error(data.error);
      }
    } catch (err: any) {
      if (err?.message === 'Invalid email or password') throw err;
      // Fallback to local demo credentials
    }

    const emailTrim = email.trim().toLowerCase();
    const found = mockUsers.find((u) => u.email.toLowerCase() === emailTrim);
    if (found) return found;

    return {
      id: `u-${Date.now()}`,
      name: email.split('@')[0],
      email: emailTrim,
      role: emailTrim.includes('admin') || emailTrim.includes('chef') ? 'ADMIN' : 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
  },

  async register(data: { name: string; email: string; phone?: string; role?: Role; password?: string }): Promise<User> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          email: data.email.trim(),
          phone: data.phone || '',
          password: data.password || 'password123',
          role: data.role || 'CUSTOMER',
        }),
      });
      if (res.ok) {
        return await res.json();
      }
      const errData = await res.json().catch(() => null);
      if (errData?.error && errData.error.includes('already exists')) {
        throw new Error(errData.error);
      }
    } catch (err: any) {
      if (err?.message?.includes('already exists')) throw err;
      // fallback
    }

    return {
      id: `u-${Date.now()}`,
      name: data.name,
      email: data.email.trim(),
      phone: data.phone,
      role: data.role || 'CUSTOMER',
      createdAt: new Date().toISOString(),
    };
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // ignore
    }
  },

  async getMe(): Promise<User | null> {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return getStoredUser();
  },

  async demoSwitch(role: Role): Promise<User> {
    try {
      const res = await fetch('/api/auth/demo-switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }
    return role === 'ADMIN' ? mockUsers[0] : mockUsers[1];
  },

  // ==========================================
  // Menu APIs
  // ==========================================
  async getMenuItems(params?: { category?: string; availableOnly?: boolean }): Promise<MenuItem[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category && params.category !== 'All') query.set('category', params.category);
      if (params?.availableOnly) query.set('available', 'true');
      const url = `/api/menu${query.toString() ? `?${query.toString()}` : ''}`;

      const res = await fetch(url, { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        return sanitizeMenu(data);
      }
    } catch {
      // fallback to mock
    }

    let items = getStoredMenu();
    if (params?.category && params.category !== 'All') {
      items = items.filter((i) => i.category === params.category);
    }
    if (params?.availableOnly) {
      items = items.filter((i) => i.available && !i.isArchived);
    }
    return items;
  },

  async createMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<MenuItem> {
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(item),
      });
      if (res.ok) {
        return await res.json();
      }
      const data = await res.json().catch(() => null);
      if (data?.error) throw new Error(data.error);
    } catch (err: any) {
      if (err?.message && !err.message.includes('fetch')) throw err;
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
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        return await res.json();
      }
      const data = await res.json().catch(() => null);
      if (data?.error) throw new Error(data.error);
    } catch (err: any) {
      if (err?.message && !err.message.includes('fetch')) throw err;
      // fallback
    }

    const current = getStoredMenu();
    const index = current.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Menu item not found');
    current[index] = { ...current[index], ...updates, updatedAt: new Date().toISOString() };
    setStoredMenu(current);
    return current[index];
  },

  async toggleMenuItem(id: string): Promise<MenuItem> {
    try {
      const res = await fetch(`/api/menu/${id}/toggle`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const current = getStoredMenu();
    const item = current.find((i) => i.id === id);
    if (!item) throw new Error('Menu item not found');
    item.available = !item.available;
    item.updatedAt = new Date().toISOString();
    setStoredMenu(current);
    return item;
  },

  async deleteMenuItem(id: string): Promise<void> {
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      if (res.ok) return;
    } catch {
      // fallback
    }
    const current = getStoredMenu().filter((i) => i.id !== id);
    setStoredMenu(current);
  },

  // ==========================================
  // Order APIs
  // ==========================================
  async getOrders(params?: { status?: string; date?: string; customerId?: string; search?: string }): Promise<Order[]> {
    try {
      const query = new URLSearchParams(params as Record<string, string>).toString();
      const res = await fetch(`/api/orders?${query}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    let orders = getStoredOrders();
    if (params?.status && params.status !== 'ALL') {
      orders = orders.filter((o) => o.status === params.status);
    }
    if (params?.customerId) {
      orders = orders.filter((o) => o.userId === params.customerId);
    }
    if (params?.search) {
      const s = params.search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.id.toLowerCase().includes(s) ||
          o.user?.name.toLowerCase().includes(s) ||
          o.items.some((i) => i.itemNameSnapshot.toLowerCase().includes(s))
      );
    }
    return orders;
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
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
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        return await res.json();
      }
      const data = await res.json().catch(() => null);
      if (data?.error) throw new Error(data.error);
    } catch (err: any) {
      if (err?.message && !err.message.includes('fetch')) throw err;
      // fallback
    }

    const menu = getStoredMenu();
    let total = 0;
    const orderItems = payload.items.map((item) => {
      const menuItem = menu.find((m) => m.id === item.menuItemId);
      const unitPrice = menuItem ? Number(menuItem.price) : 10;
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

    // Packaging fee (BDT 50)
    total += 50.00;

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
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        return await res.json();
      }
      const data = await res.json().catch(() => null);
      if (data?.error) throw new Error(data.error);
    } catch (err: any) {
      if (err?.message && !err.message.includes('fetch')) throw err;
      // fallback
    }

    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');

    // Rule: prevent changing status of completed or cancelled orders
    if (orders[index].status === 'COMPLETED' || orders[index].status === 'CANCELLED') {
      if (orders[index].status !== status) {
        throw new Error(`Cannot change status of a ${orders[index].status} order. It is locked.`);
      }
    }

    orders[index] = { ...orders[index], status, updatedAt: new Date().toISOString() };
    setStoredOrders(orders);
    return orders[index];
  },

  async updateOrderNotes(id: string, notes: string): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${id}/notes`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ notes }),
      });
      if (res.ok) {
        return await res.json();
      }
      const data = await res.json().catch(() => null);
      if (data?.error) throw new Error(data.error);
    } catch (err: any) {
      if (err?.message && !err.message.includes('fetch')) throw err;
      // fallback
    }

    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');
    orders[index] = { ...orders[index], notes, updatedAt: new Date().toISOString() };
    setStoredOrders(orders);
    return orders[index];
  },

  async submitOrderFeedback(id: string, rating: number, note?: string): Promise<Order> {
    try {
      const res = await fetch(`/api/orders/${id}/feedback`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({ rating, note }),
      });
      if (res.ok) {
        return await res.json();
      }
      const data = await res.json().catch(() => null);
      if (data?.error) throw new Error(data.error);
    } catch (err: any) {
      if (err?.message && !err.message.includes('fetch')) throw err;
      // fallback
    }

    const orders = getStoredOrders();
    const index = orders.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Order not found');
    orders[index] = {
      ...orders[index],
      feedbackRating: rating,
      feedbackNote: note || null,
      updatedAt: new Date().toISOString(),
    };
    setStoredOrders(orders);
    return orders[index];
  },

  // ==========================================
  // Dashboard Analytics
  // ==========================================
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const res = await fetch('/api/dashboard/summary', {
        credentials: 'include',
        headers: getAuthHeaders(),
      });
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
