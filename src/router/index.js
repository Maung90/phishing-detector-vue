import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/guest/HomeView.vue'
import ResultView from '../views/guest/ResultView.vue'
import LoginView from '../views/admin/LoginView.vue'
import DashboardView from '../views/admin/DashboardView.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

const routes = [
   { 
      path: '/', 
      name: 'Home', 
      component: HomeView 
   },
   { 
      path: '/result', 
      name: 'Result', 
      component: ResultView 
   },
   { 
      path: '/login', 
      name: 'Login', 
      component: LoginView 
   },
   { 
      path: '/admin', 
      component: AdminLayout,
      meta: { requiresAuth: true 
   },
      children: [
         { 
            path: 'dashboard', 
            name: 'Dashboard', 
            component: DashboardView 
         },
      ]
   }
]

const router = createRouter({
   history: createWebHistory(),
   routes
})

router.beforeEach((to, from, next) => {
   const token = localStorage.getItem('access_token');

   if (to.meta.requiresAuth && !token) {
      next({ name: 'Login' });
   } else if (to.name === 'Login' && token) {
      next({ name: 'Dashboard' });
   } else {
      next();
   }
})

export default router