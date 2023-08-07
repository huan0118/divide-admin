import { createRouter, createWebHistory } from 'vue-router'
import { basicRoutes } from './basic'
import { userPermissionHook } from '@/hooks/modules/userPermissionHook'

const { dynamicNoopList } = userPermissionHook()

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: basicRoutes
})
/** 重置路由 */
export function resetRouter() {
  dynamicNoopList.forEach((cb) => cb())
}

export default router
