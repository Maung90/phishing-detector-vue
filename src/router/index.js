import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    redirect: '/scanner'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { requiresGuest: true }
  },
  
  // Guest Routes
  {
    path: '/scanner',
    name: 'Scanner',
    component: () => import('@/views/guest/ScannerView.vue'),
    meta: { requiresAuth: false, role: 'guest' }
  },
  
  // Developer Routes
  {
    path: '/developer',
    name: 'DeveloperDashboard',
    component: () => import('@/views/developer/DashboardView.vue'),
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/developer/manage-key',
    name: 'KeyManagement',
    component: () => import('@/views/developer/KeyManagementView.vue'),
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/developer/keys',
    name: 'KeyManagement',
    component: () => import('@/views/developer/KeysView.vue'),
    meta: { requiresAuth: true, role: 'user' }
  },
  
  // Admin Routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('@/views/admin/DashboardView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/models',
    name: 'ModelManagement',
    component: () => import('@/views/admin/ModelManagementView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/feedback',
    name: 'FeedbackView',
    component: () => import('@/views/admin/FeedbackView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/history',
    name: 'DetectionHistory',
    component: () => import('@/views/admin/HistoryView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/admin/users',
    name: 'UsersManagement',
    component: () => import('@/views/admin/UserView.vue'),
    meta: { requiresAuth: true, role: 'admin' }
  },
  
  // 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
router.beforeEach((to, from) => {
  const authStore = useAuthStore()
  
  // 1. Jika rute butuh login, tapi user BELUM login
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  } 
  
  // 2. Jika user SUDAH login, tapi mencoba akses halaman guest (seperti /login)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    if (authStore.userRole === 'admin') return '/admin'
    if (authStore.userRole === 'developer') return '/developer'
    return '/scanner'
  } 
  
  // 3. Jika user SUDAH login, tapi mencoba akses rute yang bukan role-nya
  if (authStore.isAuthenticated && to.meta.role && authStore.userRole !== to.meta.role) {
    if (authStore.userRole === 'admin') return '/admin'
    if (authStore.userRole === 'developer') return '/developer'
    return '/scanner'
  } 
  
  // 4. Aman! Lanjutkan ke halaman yang dituju
  return true 
})

export default router