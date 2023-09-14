import { http } from '@/utils/http/Axios'
import type { UserInfo } from '~/types/api'

export interface UserResult {
  code: number
  data: UserInfo
}

export interface RefreshTokenResult {
  code: number
  data: {
    /** `token` */
    accessToken: string
  }
}

export interface ExpireResult {
  code: number
  data: {
    /** `头部` */
    _req: object
  }
}

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>('post', '/login', { data })
}

/** 登出 */
export const logout = () => {
  return http.request<null>('get', '/logout')
}

/** 刷新token */
export const refreshTokenApi = () => {
  return http.request<RefreshTokenResult>('get', '/refreshToken')
}
