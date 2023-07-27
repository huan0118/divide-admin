import Axios from 'axios'
import { stringify } from 'qs'
import type { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer } from 'axios'
import type { PHttpError, RequestMethods, PHttpResponse, PHttpRequestConfig } from './types.d'

/** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
const whiteList = ['/refreshToken', '/login']

import { useUserStoreHook } from '@/hooks/modules/userHook'

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // 请求超时时间
  timeout: 10000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
}

class SAxios {
  /** promise 锁 用于重置token过期 */
  private promiseLock: Promise<any>
  public triggerResolveLock!: (value: any) => void
  public triggerRejectLock!: (value: any) => void
  /** 过期标识 */
  private isExpired = false

  /** 防止重复刷新token */
  private isRefreshing = false

  /** 初始化配置对象 */
  private static initConfig: PHttpRequestConfig = {}

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig)

  constructor() {
    this.httpInterceptorsRequest()
    this.httpInterceptorsResponse()

    this.promiseLock = new Promise((resolve, reject) => {
      this.triggerResolveLock = resolve
      this.triggerRejectLock = reject
    })
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    SAxios.axiosInstance.interceptors.request.use(
      async (config: PHttpRequestConfig): Promise<any> => {
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config)
          return config
        }
        if (SAxios.initConfig.beforeRequestCallback) {
          SAxios.initConfig.beforeRequestCallback(config)
          return config
        }
        if (whiteList.find((url) => url === config.url)) {
          return config
        } else {
          /**判断是否过期 */
          if (this.isExpired) {
            if (this.isRefreshing) {
              const token = await this.promiseLock
              config.headers!['Authorization'] = token
            } else {
              try {
                this.isRefreshing = true
                const { userInfo } = await useUserStoreHook()
                const token = userInfo.value.accessToken
                config.headers!['Authorization'] = token
                this.triggerResolveLock(token)
                this.isExpired = false
              } catch (error) {
                console.group('token 刷新失败!!!')
                console.warn(error)
                console.groupEnd()
                this.triggerRejectLock(error)
              } finally {
                /**重新初始化锁 */
                this.isRefreshing = false
                this.promiseLock = new Promise((resolve, reject) => {
                  this.triggerResolveLock = resolve
                  this.triggerRejectLock = reject
                })
              }
            }
          } else {
            return config
          }
        }
      },
      (error) => {
        return Promise.reject(error)
      }
    )
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = SAxios.axiosInstance
    instance.interceptors.response.use(
      (response: PHttpResponse) => {
        const $config = response.config
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === 'function') {
          $config.beforeResponseCallback(response)
          return response.data
        }
        if (SAxios.initConfig.beforeResponseCallback) {
          SAxios.initConfig.beforeResponseCallback(response)
          return response.data
        }
        return response.data
      },
      (error: PHttpError) => {
        const $error = error
        $error.isCancelRequest = Axios.isCancel($error)
        // 所有的响应异常 区分来源为取消请求/非取消请求
        if ($error.code === '401') {
          this.isExpired = true
          return SAxios.axiosInstance.request(error.config!)
        }
        return Promise.reject($error)
      }
    )
  }

  /** 通用请求工具函数 */
  public request<T>(
    method: RequestMethods,
    url: string,
    param?: AxiosRequestConfig,
    axiosConfig?: PHttpRequestConfig
  ): Promise<T> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PHttpRequestConfig

    // 单独处理自定义请求/响应回调
    return SAxios.axiosInstance.request(config)
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PHttpRequestConfig
  ): Promise<P> {
    return this.request<P>('post', url, params, config)
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(
    url: string,
    params?: AxiosRequestConfig<T>,
    config?: PHttpRequestConfig
  ): Promise<P> {
    return this.request<P>('get', url, params, config)
  }
}

export const http = new SAxios()
