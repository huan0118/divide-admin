interface MenuRow {
  httpUrl: string
  imageLink: string
  levelId: number
  menuCode: string
  menuId: number
  menuName: string
  menuParentId: number
  menuType: string
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
