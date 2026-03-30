import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import MarketView from '../views/MarketView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MarketView
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue')
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      props: true
    },
    {
      path: '/seller/dashboard',
      name: 'seller-dashboard',
      component: () => import('../views/SellerDashboardView.vue'),
      meta: { requiresAuth: true, role: 'seller' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth) {
    if (to.meta.role && authStore.profile?.role !== to.meta.role) {
      // User is not authorized to see this page, kick back to home
      return next('/')
    }
  }
  
  next()
})

export default router
