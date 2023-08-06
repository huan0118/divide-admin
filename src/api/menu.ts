import { http } from '@/utils/http/Axios'

export interface MenuResult {
  code: number
  data: MenuTreeInfo
}

/** 获取菜单信息 */
export const getMenu = (token: string) => {
  return http.request<MenuResult>('get', '/divide-admin/routes', { data: { token } })
}
