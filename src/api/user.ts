import { http } from '@/utils/http/Axios'
import type { UserInfo } from '~/types/user'

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

/** 登录 */
export const getLogin = (data?: object) => {
  return http.request<UserResult>('post', '/login', { data })
}

/** 登出 */
export const logout = () => {
  return http.request<null>('get', '/logout')
}

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>('post', '/refreshToken', { data })
}
