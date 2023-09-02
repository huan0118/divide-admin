import 'vue-router'
import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { Method, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'

declare module 'vue-router' {
  interface RouteMeta {
    menuId?: number
    ignoreRoute?: boolean
    _permissions?: PermissionRow
    _pressButtons?: PressButtonRow[]
  }
}

export type tagsPositionType = {
  left: number
  top: number
  selectedTag: null | RouteLocationNormalizedLoaded
}

export type resultType = {
  accessToken?: string
}

export type RequestMethods = Extract<
  Method,
  'get' | 'post' | 'put' | 'delete' | 'patch' | 'option' | 'head'
>

export interface PHttpError extends AxiosError {
  isCancelRequest?: boolean
}

export interface PHttpResponse extends AxiosResponse {
  config: PHttpRequestConfig
}

export interface PHttpRequestConfig extends AxiosRequestConfig {
  beforeRequestCallback?: (request: PHttpRequestConfig) => void
  beforeResponseCallback?: (response: PHttpResponse) => void
}

export default class SAxios {
  request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PHttpRequestConfig
  ): Promise<T>
  post<T, P>(url: string, params?: T, config?: PHttpRequestConfig): Promise<P>
  get<T, P>(url: string, params?: T, config?: PHttpRequestConfig): Promise<P>
}
