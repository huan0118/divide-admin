import { type RouteRecordRaw } from 'vue-router'
import login from '../views/login/login.vue'
import layout from '@/Layout/LayoutView.vue'
import redirect from '../redirect/index.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Dashboard',
    component: layout
  },
  {
    path: '/login',
    name: 'Login',
    component: login
  },
  {
    path: '/redirect/:path(.*)',
    component: redirect,
    name: 'Redirect'
  },
  {
    path: '/:notFoundPath(.*)*',
    meta: {
      hidden: true
    },
    component: () => import(/* webpackChunkName: "notFound" */ '../Layout/notFound.vue')
  }
]
