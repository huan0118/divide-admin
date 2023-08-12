/**
 * 权限按钮
 */
interface PressButtonRow {
  name: string
  code: string
}
/**
 * 岗位职能
 */
interface PermissionRow {
  jobId: string | number
  jobName: string
  resourceType: string
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

// /**
//  * 职能数据类型说明
//  */
// interface JobRow {
//   jobId: number
//   jobName: string
//   resourceType: string
// }

// declare type JobList = Readonly<JobRow>[]
