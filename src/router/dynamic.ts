import type { RouteRecordRaw } from 'vue-router'

export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: 'HomeView',
    // name: 'HomeView',
    meta: {
      affix: true,
      menuId: 2713025
    },
    component: () => import(/* webpackChunkName: "HomeView" */ '../views/HomeView.vue')
  },

  {
    path: 'nested1',
    name: 'nested1',
    component: () => import(/* webpackChunkName: "nested1" */ '../views/nested/menu1.vue'),
    children: [
      {
        path: 'nested2',
        name: 'nested2',
        component: () => import(/* webpackChunkName: "nested2" */ '../views/nested/menu2.vue'),

        children: [
          {
            path: 'nested3',
            meta: {
              menuId: 2803012
            },
            component: () => import(/* webpackChunkName: "nested3" */ '../views/nested/menu3.vue')
          }
        ]
      }
    ]
  }
  // {
  //   path: 'AboutView',
  //   name: 'AboutView',
  //   meta: {
  //     menuId: 2803012
  //   },
  //   component: () => import(/* webpackChunkName: "AboutView" */ '../views/AboutView.vue')
  // }
]
