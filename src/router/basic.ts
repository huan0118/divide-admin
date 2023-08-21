import { type RouteRecordRaw } from 'vue-router'
import login from '@/views/LoginView.vue'
import layout from '@/Layout/LayoutView.vue'
import redirect from '@/Layout/RedirectView.vue'

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
      hidden: true
    },
    component: () => import(/* webpackChunkName: "notFound" */ '@/Layout/NotFound.vue')
  }
]
