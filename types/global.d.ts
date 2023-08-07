interface MenuRow {
  hidden?: boolean
  httpUrl: string
  icon: string
  levelId: number
  menuId: number
  menuName: string
  menuParentId: number
  systemCode: string
}

interface ResourceRow {
  resourceId: number
  resourceName: string
  resourceType: string
}

interface TreeInfo<T = MenuRow> extends MenuRow {
  children?: T[]
}
declare type MenuTreeInfo = Readonly<TreeInfo>[]
