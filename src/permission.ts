import router from '@/router'
import { ElMessage } from 'element-plus'
import { useUserStoreHook } from '@/hooks/modules/userHook'
import { userPermissionHook } from '@/hooks/modules/userPermissionHook'

const { userInfo, DEL_USER_INFO } = useUserStoreHook()
const { dynamicMenu, dynamicNoopList, GET_MENU, GENERATE_FINAL_ROUTES } = userPermissionHook()
const whiteList = ['/login'] // 白名单

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
          // 生成路由
          const MenuTreeData = await GET_MENU(hasToken)
          const accessRoutes = await GENERATE_FINAL_ROUTES(MenuTreeData)
          for (const row of accessRoutes) {
            dynamicNoopList.push(router.addRoute('Dashboard', row))
          }
          if (accessRoutes.length) {
            return accessRoutes[0].path
          } else {
            return true
          }
        } catch (error) {
          console.group('permission generate: failed')
          console.warn(error)
          console.groupEnd()
          DEL_USER_INFO()
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
