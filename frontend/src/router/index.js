import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/register', name: 'register', component: () => import('../views/Register.vue') },
    { path: '/login', name: 'login', component: () => import('../views/SignIn.vue') },
    { path: '/add-listing', name: 'add-listing', component: () => import('../views/AddListing.vue') }
  ]
})

export default router