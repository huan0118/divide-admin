import router from '@/router'
import { ElMessage } from 'element-plus'
import { useUserStoreHook } from '@/hooks/modules/userHook'
import { userPermissionHook } from '@/hooks/modules/userPermissionHook'
import { useLocalMenuActive } from '@/hooks/modules/useLocalMenuActive'
import type { RouteRecordRaw } from 'vue-router'

const { userInfo, DEL_USER_INFO } = useUserStoreHook()
const {
  dynamicMenu,
  dynamicNoopList,
  routeMap,
  GET_MENU,
  GENERATE_FINAL_ROUTES,
  CLEAN_DYNAMIC_MENU_DATA
} = userPermissionHook()
const whiteList = ['/login', '/notFoundPath'] // 白名单
const { localMenuActive, localAffixActive, localEndActiveType } = useLocalMenuActive()

router.beforeEach(async (to, from) => {
  const hasToken = userInfo.value.accessToken
  if (hasToken) {
    if (to.path === '/login') {
      // 防止用户手动返回
      return { path: '/' }
    } else {
      if (dynamicMenu.value.length) {
        return true
      } else {
        try {
          /**
           * 根据token获取当前用户的菜单并生成最终所拥有的权限路由
           */
          const MenuTreeData = await GET_MENU(hasToken)
          const accessRoutes = await GENERATE_FINAL_ROUTES(MenuTreeData)
          for (const row of accessRoutes) {
            dynamicNoopList.push(router.addRoute('Dashboard', row))
          }
          let routeCache: RouteRecordRaw | string | null = null

          if (localEndActiveType.value) {
            if (localEndActiveType.value === 'nav') {
              routeCache =
                routeMap.get(+localMenuActive.value) || `/noRolePage?redirectFrom=${to.path}`
            } else {
              routeCache = localAffixActive.value
            }
          }
          if (routeCache) {
            return routeCache
          } else if (accessRoutes.length) {
            return accessRoutes[0]
          } else {
            return true
          }
        } catch (error) {
          console.group('permission generate: failed')
          console.warn(error)
          console.groupEnd()
          DEL_USER_INFO()
          CLEAN_DYNAMIC_MENU_DATA()
          ElMessage.error('菜单初始化失败')
          try {
            if (whiteList.indexOf(from.path) !== -1) {
              return false
            } else {
              return {
                path: '/login',
                replace: true,
                query: { redirect: to.path }
              }
            }
          } catch (err) {
            console.log('redirect', err)
          }
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      return true
    } else {
      return `/login?redirect=${to.path}`
    }
  }
})
