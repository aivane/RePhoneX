import { createRouter, createWebHistory } from 'vue-router'
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
      path: '/product/:id',
      name: 'product-detail',
      component: () => import('../views/ProductDetailView.vue'),
      props: true
    }
  ]
})

export default router
