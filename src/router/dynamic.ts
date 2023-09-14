import type { RouteRecordRaw } from 'vue-router'

/**
 * 需动态加载的权限路由
 *   声明 menuId 或 ignoreRoute 来过滤权限路由与非强制绑定权限路由
 */

export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: '',
    name: 'Welcome',
    meta: {
      affix: true,
      title: '首页',
      menuId: 4123040
    },
    component: () => import(/* webpackChunkName: "DashboardView" */ '@/views/DashboardView.vue')
  },
  {
    path: 'HomeView',
    // name: 'HomeView',
    meta: {
      affix: true,
      menuId: 2713025,
      title: '权限配置'
    },
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/HomeView.vue')
  },

  {
    path: 'nested1',
    name: 'nested1',
    component: () => import(/* webpackChunkName: "nested1" */ '@/views/nested/menu1.vue'),
    children: [
      {
        path: 'nested2',
        name: 'nested2',
        component: () => import(/* webpackChunkName: "nested2" */ '@/views/nested/menu2.vue'),

        children: [
          {
            path: 'nested3',
            meta: {
              menuId: 2803012,
              affix: true,
              title: 'nested'
            },
            component: () => import(/* webpackChunkName: "nested3" */ '@/views/nested/menu3.vue')
          }
        ]
      },
      // Will not become an official route
      {
        path: 'nested4',
        name: 'nested4',
        component: () => import(/* webpackChunkName: "nested4" */ '@/views/nested/menu2.vue')
      }
    ]
  },
  {
    path: '/TableView',
    name: 'TableView',
    meta: {
      affix: true,
      menuId: 1110027,
      title: '权限表格'
    },
    component: () => import(/* webpackChunkName: "TableView" */ '@/views/TableView.vue')
  },
  {
    path: '/EditTable/:id',
    name: 'EditTable',
    meta: {
      affix: true,
      ignoreRoute: true,
      title: '新建表单'
    },
    component: () => import(/* webpackChunkName: "EditTable" */ '@/views/other/EditTable.vue')
  }
]
