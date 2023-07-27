import { http } from '@/utils/http/Axios'
import type { UserInfo } from '~/types/store'

export interface UserResult extends UserInfo {
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

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<RefreshTokenResult>('post', '/refreshToken', { data })
}
