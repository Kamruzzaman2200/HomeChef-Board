export type Role = 'CUSTOMER' | 'ADMIN';

export type OrderStatus =
  | 'REQUESTED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY'
  | 'COMPLETED'
  | 'CANCELLED';

export type FulfillType = 'PICKUP' | 'DELIVERY';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  createdAt?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string | null;
  category: string;
  price: number;
  image?: string | null;
  available: boolean;
  isArchived?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  id: string;
  orderId?: string;
  menuItemId?: string | null;
  itemNameSnapshot: string;
  quantity: number;
  unitPrice: number;
  menuItem?: MenuItem | null;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  orderDate: string;
  fulfillDate?: string | null;
  fulfillTime: string;
  fulfillType: FulfillType;
  addressNote?: string | null;
  status: OrderStatus;
  total: number;
  notes?: string | null;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface DashboardStats {
  requestedCount: number;
  confirmedCount: number;
  preparingCount: number;
  readyCount: number;
  completedCount: number;
  todayRevenue: number;
  totalOrdersCount: number;
}

export interface CreateOrderPayload {
  fulfillDate: string;
  fulfillTime: string;
  fulfillType: FulfillType;
  addressNote?: string;
  notes?: string;
  items: {
    menuItemId: string;
    quantity: number;
  }[];
}
