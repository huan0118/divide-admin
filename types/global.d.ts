/**
 * 权限按钮
 */
interface PressButtonRow {
  name: string
  code: string
}
/**
 * 资源类型
 */
interface ResourceRow {
  resourceType: string
  resourceId: string
  resource: unknown
}
/**
 * 岗位职能
 */
interface PermissionRow {
  jobId: string | number
  jobName: string
  resources: ResourceRow[]
}
/**
 * 菜单项
 */

interface MenuRow {
  hidden?: boolean
  httpUrl: string
  icon: string
  levelId: number
  menuId: number
  menuName: string
  menuParentId: number
  systemCode: string
  pressButtons?: PressButtonRow[]
  permissions?: PermissionRow[]
}

interface TreeInfo<T = MenuRow> extends MenuRow {
  children?: T[]
}
declare type MenuTreeInfo = Readonly<TreeInfo>[]
