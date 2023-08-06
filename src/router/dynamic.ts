import type { RouteRecordRaw } from 'vue-router'

export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '/HomeView',
    name: 'HomeView',
    meta: {
      menuId: 2713025
    },
    component: () => import(/* webpackChunkName: "HomeView" */ '../views/HomeView.vue')
  }
]
