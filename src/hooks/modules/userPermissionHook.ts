import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'
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

function getDeepId(menuList: MenuTreeInfo) {
  const res: number[] = []
  for (const row of menuList) {
    if (!row.children || !row.children.length) {
      res.push(row.menuId)
    } else {
      res.push(...getDeepId(row.children))
    }
  }
  return res
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

export const filterAsyncRoutes = (routes: RouteRecordRaw[], menuList: MenuTreeInfo) => {
  const ids: number[] = getDeepId(menuList)
  const res: RouteRecordRaw[] = treeFilter(routes, (node: RouteRecordRaw) => {
    // 判断非叶子结点
    if (node.children && node.children.length) {
      return true
    } else if (node.children && !node.children.length) {
      return false
    } else {
      // 判断叶子结点
      if (hasPermission(node, ids)) {
        return true
      } else {
        return false
      }
    }
  })
  return res
}

export const userPermissionHook = createGlobalState(() => {
  // menu state
  const initialMenuInfo: MenuTreeInfo = []
  const dynamicMenu = useStorage('menu-store', initialMenuInfo)

  async function GET_MENU(token: string) {
    const { data } = await getMenu(token)
    dynamicMenu.value = data
    return data
  }

  function DEL_MENU() {
    dynamicMenu.value = []
  }

  async function GENERATE_FINAL_ROUTES(dynamicMenu: MenuTreeInfo) {
    const finalRoutes = filterAsyncRoutes(dynamicRoutes, dynamicMenu)
    console.log(finalRoutes)
    return finalRoutes
  }
  return { dynamicMenu, GET_MENU, DEL_MENU, GENERATE_FINAL_ROUTES }
})
