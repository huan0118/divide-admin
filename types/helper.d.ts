import 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export type tagsPositionType = {
  left: number
  top: number
  selectedTag: null | RouteLocationNormalizedLoaded
}

declare module 'vue-router' {
  interface RouteMeta {
    menuId?: number
    _permissions?: PermissionRow
    _pressButtons?: PressButtonRow[]
  }
}
