import { shallowRef } from 'vue'
import { createGlobalState, type AnyFn } from '@vueuse/shared'
import { getMenu } from '@/api/menu'
import { dynamicRoutes } from '@/router/dynamic'
import type { RouteRecordRaw } from 'vue-router'
import type { RouteLocationNormalized } from 'vue-router'

function def(
  target: object,
  propertyKey: PropertyKey,
  attributes: PropertyDescriptor & ThisType<any>
) {
  Reflect.defineProperty(target, propertyKey, attributes)
}

/**
 * 权限特有路由守卫用于设置当前页面的权限信息
 */
function effectPermissionBeforeEnter(
  menuId: number,
  cacheMap: Map<number, string | number>,
  menuMap: Map<number, MenuRow>
) {
  const { permissions, pressButtons } = menuMap.get(menuId) as MenuRow

  return function (to: RouteLocationNormalized) {
    def(to.meta, '_pressButtons', {
      value: pressButtons,
      writable: false
    })

    let permissionsRow = Object.create(null)
    if (permissions?.length) {
      const hasCachePermission =
        cacheMap.get(menuId) && permissions.find((e) => e.jobId === cacheMap.get(menuId))
      if (hasCachePermission) {
        permissionsRow = hasCachePermission
      } else {
        permissionsRow = permissions[0]
        cacheMap.set(menuId, permissionsRow.jobId)
      }
    } else {
      console.warn('当前菜单没有岗位职能', menuId)
    }

    def(to.meta, '_permissions', {
      value: permissionsRow,
      writable: false
    })
    return true
  }
}

function hasPermission(route: RouteRecordRaw, ids: number[]): boolean {
  if (route.meta) {
    return ids.includes(route.meta?.menuId as number)
  } else {
    return false
  }
}

function effectGetTreeMapId(dynamicMenu: MenuTreeInfo, menuMap: Map<number, MenuRow>) {
  const res: number[] = []
  for (const row of dynamicMenu) {
    if (row.menuId) {
      res.push(row.menuId)
      menuMap.set(row.menuId, row)
    }
    if (row.children) {
      res.push(...effectGetTreeMapId(row.children, menuMap))
    }
  }
  return Array.from(new Set(res))
}

function treeFilter(tree: RouteRecordRaw[], func: Function) {
  return tree
    .map((node) => ({ ...node }))
    .filter((node) => {
      if (node.children) {
        node.children = treeFilter(node.children, func)
      }
      return func(node)
    })
}

function effectAsyncRoutes(
  dynamicRoutes: RouteRecordRaw[],
  dynamicMenu: MenuTreeInfo,
  routeMap: Map<number, RouteRecordRaw>,
  menuMap: Map<number, MenuRow>,
  cacheCurrentRouteJobMap: Map<number, string | number>,
  cacheAffixMap: Map<number, RouteRecordRaw>
) {
  let Cid = 1
  const ids: number[] = effectGetTreeMapId(dynamicMenu, menuMap)
  const res: RouteRecordRaw[] = treeFilter(dynamicRoutes, (node: RouteRecordRaw) => {
    /**
     * 从叶子节点开始判断收敛
     */
    if (node.meta?.ignoreRoute || hasPermission(node, ids) || node.children?.length) {
      const _cid = Cid++
      if (node.meta?.menuId) {
        routeMap.set(node.meta.menuId, node)

        node.beforeEnter = effectPermissionBeforeEnter(
          node.meta!.menuId,
          cacheCurrentRouteJobMap,
          menuMap
        )
      } else {
        if (node.meta?.affix) {
          node.meta._cid = _cid
          cacheAffixMap.set(_cid, node)
        }
      }
      if (!node.name) {
        node.name = (node.path.split('/').pop() ?? '').toLocaleUpperCase()
      }

      return true
    } else {
      return false
    }
  })
  return res
}

export const userPermissionHook = createGlobalState(() => {
  /**
   * 菜单数据与菜单映射
   */
  const initialMenuInfo: MenuTreeInfo = []
  /**  服务端返回的菜单数据 */
  const dynamicMenu = shallowRef(initialMenuInfo)
  /**  addRoute返回的函数列表 */
  const dynamicNoopList: AnyFn[] = []
  /**  记录menuId与过滤后的路由映射 */
  const routeMap = new Map<number, RouteRecordRaw>()
  /**  记录menuId与服务端菜单项映射 */
  const menuMap = new Map<number, MenuRow>()
  const cacheCurrentRouteJobMap = new Map<number, string | number>()
  const cacheAffixMap = new Map<number, RouteRecordRaw>()

  async function GET_MENU(token: string) {
    const { data } = await getMenu(token)
    dynamicMenu.value = data
    return data
  }

  function CLEAN_DYNAMIC_MENU_DATA() {
    routeMap.clear()
    menuMap.clear()
    cacheCurrentRouteJobMap.clear()
    cacheAffixMap.clear()
    dynamicMenu.value = []
    dynamicNoopList.length = 0
  }

  async function GENERATE_FINAL_ROUTES(dynamicMenu: MenuTreeInfo) {
    const finalRoutes = effectAsyncRoutes(
      dynamicRoutes,
      dynamicMenu,
      routeMap,
      menuMap,
      cacheCurrentRouteJobMap,
      cacheAffixMap
    )
    return finalRoutes
  }
  return {
    dynamicMenu,
    menuMap,
    dynamicNoopList,
    routeMap,
    cacheCurrentRouteJobMap,
    cacheAffixMap,
    GET_MENU,
    CLEAN_DYNAMIC_MENU_DATA,
    GENERATE_FINAL_ROUTES
  }
})
