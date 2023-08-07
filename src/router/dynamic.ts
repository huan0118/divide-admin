import type { RouteRecordRaw } from 'vue-router'

export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/HomeView',
    meta: {
      menuId: 2713025
    },
    component: () => import(/* webpackChunkName: "HomeView" */ '../views/HomeView.vue')
  },

  {
    path: '/AboutView',
    name: 'AboutView',
    meta: {
      menuId: 2803012
    },
    component: () => import(/* webpackChunkName: "AboutView" */ '../views/AboutView.vue')
  }
]
