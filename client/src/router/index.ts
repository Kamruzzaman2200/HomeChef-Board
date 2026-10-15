import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// Page components
import Home from '@/pages/Home.vue';
import Login from '@/pages/auth/Login.vue';
import Register from '@/pages/auth/Register.vue';
import PlaceOrder from '@/pages/customer/PlaceOrder.vue';
import MyOrders from '@/pages/customer/MyOrders.vue';
import OrderDetail from '@/pages/customer/OrderDetail.vue';
import Dashboard from '@/pages/admin/Dashboard.vue';
import DailyOrderBoard from '@/pages/admin/DailyOrderBoard.vue';
import MenuManagement from '@/pages/admin/MenuManagement.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { layout: 'customer', title: 'Home - Handcrafted Kitchen Pre-Orders' },
  },
  {
    path: '/menu',
    name: 'Menu',
    component: Home,
    meta: { layout: 'customer', title: 'Menu - Handcrafted Kitchen Pre-Orders' },
  },
  {
    path: '/order',
    name: 'PlaceOrder',
    component: PlaceOrder,
    meta: { layout: 'customer', title: 'Place Pre-Order - HomeChef Board' },
  },
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: MyOrders,
    meta: { layout: 'customer', title: 'My Orders - HomeChef Board' },
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: OrderDetail,
    meta: { layout: 'customer', title: 'Order Details - HomeChef Board' },
  },
  // Admin Routes
  {
    path: '/admin',
    redirect: '/admin/daily-board',
  },
  {
    path: '/admin/daily-board',
    name: 'DailyOrderBoard',
    component: DailyOrderBoard,
    meta: { layout: 'admin', title: 'Daily Kitchen Prep Board - HomeChef' },
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: Dashboard,
    meta: { layout: 'admin', title: 'Kitchen Analytics - HomeChef' },
  },
  {
    path: '/admin/menu-management',
    name: 'MenuManagement',
    component: MenuManagement,
    meta: { layout: 'admin', title: 'Menu Management - HomeChef' },
  },
  // Auth Routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { layout: 'customer', title: 'Sign In - HomeChef Board' },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { layout: 'customer', title: 'Register - HomeChef Board' },
  },
  // Catch all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to, _from, next) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} | HomeChef Board`;
  }
  next();
});

export default router;
