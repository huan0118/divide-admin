import { createRouter, createWebHistory } from 'vue-router'
import { basicRoutes } from './basic'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: basicRoutes
})

export default router
