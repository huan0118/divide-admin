import { type RouteRecordRaw } from 'vue-router'
import login from '@/views/LoginView.vue'
import redirect from '@/Layout/RedirectView.vue'
import ErrPage from '@/Layout/ErrPage.vue'

/**
 * 基础路由
 *  Dashboard 作为根路由承载权限过滤后的路由
 */

export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import(/* webpackChunkName: "Layout" */ '@/Layout/LayoutView.vue'),
    children: [
      {
        path: '/redirect/:path(.*)',
        component: redirect,
        name: 'Redirect'
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: login
  },
  {
    path: '/:notFoundPath(.*)*',
    meta: {
      hidden: true,
      title: '404'
    },
    component: ErrPage
  }
]
