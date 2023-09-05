import { type RouteRecordRaw } from 'vue-router'
import login from '@/views/LoginView.vue'
import layout from '@/Layout/LayoutView.vue'
import redirect from '@/Layout/RedirectView.vue'

/**
 * 基础路由
 *    由于切换职能职能所对应的所有资源都将切换redirect为重新刷新页面职能设计
 */

export const basicRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: layout,
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
    component: () => import(/* webpackChunkName: "ErrPage" */ '@/Layout/ErrPage.vue')
  }
]
