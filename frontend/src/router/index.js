import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/register', name: 'register', component: () => import('../views/Register.vue') },
    { path: '/login', name: 'login', component: () => import('../views/SignIn.vue') },
    {
      path: '/add-listing',
      name: 'add-listing',
      component: () => import('../views/AddListing.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/listing/:id',
      name: 'listing-detail',
      component: () => import('../views/ListingDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/listings/my-listings',
      name: 'my-listings',
      component: () => import('../views/MyListings.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/edit-listing/:id',
      name: 'EditListing',
      component: () => import('@/views/AddListing.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (authStore.loading) {
    await authStore.init()
  }
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isLoggedIn) {
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
