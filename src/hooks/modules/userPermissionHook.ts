import { shallowRef } from 'vue'
import { createGlobalState, type AnyFn } from '@vueuse/shared'
import { getMenu } from '@/api/menu'
import { dynamicRoutes } from '@/router/dynamic'
import type { RouteRecordRaw } from 'vue-router'

function hasPermission(route: RouteRecordRaw, ids: number[]): boolean {
  if (route.meta) {
    return ids.includes(route.meta?.menuId as number)
  } else {
    return false
  }
}

function getTreeId(menuList: MenuTreeInfo) {
  const res: number[] = []
  for (const row of menuList) {
    res.push(row.menuId)
    if (row.children) {
      res.push(...getTreeId(row.children))
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

export const effectAsyncRoutes = (
  routes: RouteRecordRaw[],
  menuList: MenuTreeInfo,
  routeMap: Map<number, RouteRecordRaw>
) => {
  const ids: number[] = getTreeId(menuList)
  console.log(ids)
  const res: RouteRecordRaw[] = treeFilter(routes, (node: RouteRecordRaw) => {
    // 判断非叶子结点
    if (node.children && node.children.length) {
      return true
    } else if (node.children && !node.children.length) {
      return false
    } else {
      // 判断叶子结点
      if (hasPermission(node, ids)) {
        /**
         * 设置两个数据结构的对应关系并为RouteRecordRaw添加name
         */
        routeMap.set(node.meta!.menuId as number, node)
        if (!node.name) {
          node.name = Symbol(node.meta!.menuId as number)
        }
        return true
      } else {
        return false
      }
    }
  })
  return res
}

export const userPermissionHook = createGlobalState(() => {
  /**
   * 菜单数据与菜单映射
   */
  const initialMenuInfo: MenuTreeInfo = []
  const dynamicMenu = shallowRef(initialMenuInfo)
  const routeMap = new Map<number, RouteRecordRaw>()
  const dynamicNoopList: AnyFn[] = []

  async function GET_MENU(token: string) {
    const { data } = await getMenu(token)
    dynamicMenu.value = data
    return data
  }

  function CLEAN_DYNAMIC_MENU_DATA() {
    dynamicMenu.value = []
    routeMap.clear()
    dynamicNoopList.length = 0
  }

  async function GENERATE_FINAL_ROUTES(dynamicMenu: MenuTreeInfo) {
    const finalRoutes = effectAsyncRoutes(dynamicRoutes, dynamicMenu, routeMap)
    console.log(finalRoutes, routeMap)
    return finalRoutes
  }
  return {
    dynamicMenu,
    routeMap,
    dynamicNoopList,
    GET_MENU,
    CLEAN_DYNAMIC_MENU_DATA,
    GENERATE_FINAL_ROUTES
  }
})
