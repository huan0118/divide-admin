import Axios from 'axios'
import { stringify } from 'qs'
import type { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer } from 'axios'
import type { PHttpError, RequestMethods, PHttpResponse, PHttpRequestConfig } from './types.d'
import { ElNotification } from 'element-plus'
import { useUserStoreHook } from '@/hooks/modules/userHook'
import { refreshTokenApi } from '@/api/user'

/** 请求白名单，放置一些不需要token的接口 */
const whiteList = ['/refreshToken', '/login']

/** 重置token名单，用于获取未过期的token后重置 （白名单的请求可能包含外部请求） */
const resetTokenList = ['/refreshToken', '/login']

function matchCurrying(group: string[]) {
  return function (url?: string) {
    return url && group.some((row) => url.match(row))
  }
}

const isWhite = matchCurrying(whiteList)
const isReset = matchCurrying(resetTokenList)

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_BASE_PAI_URL,
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
  /** promise 切面锁 用于重置token过期 */
  private promiseLock: Promise<string>
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
        /**
         * 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
         *
         * 自定义的初始化设置暂未注入切面锁！！！
         */
        if (typeof config.beforeRequestCallback === 'function') {
          config.beforeRequestCallback(config)
          return config
        }
        if (SAxios.initConfig.beforeRequestCallback) {
          SAxios.initConfig.beforeRequestCallback(config)
          return config
        }
        if (isWhite(config.url)) {
          return config
        } else if (isReset(config.url)) {
          return config
        } else {
          const { REST_TOKEN, userInfo } = useUserStoreHook()
          /**判断是否过期 */
          if (this.isExpired) {
            if (this.isRefreshing) {
              const token = await this.promiseLock
              config.headers!['Authorization'] = token
            } else {
              try {
                this.isRefreshing = true
                const { data } = await refreshTokenApi()
                const token = data.accessToken
                config.headers!['Authorization'] = token
                /** 重置当前用户的token */
                REST_TOKEN(token)
                this.triggerResolveLock(token)
                this.isExpired = false
              } catch (error) {
                console.group('token 刷新失败!!!')
                console.warn(error)
                console.groupEnd()
                this.triggerRejectLock(error)
              }
            }
            return config
          } else {
            config.headers!['Authorization'] = userInfo.value.accessToken
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
        if (isReset($config.url)) {
          setTimeout(() => {
            /**
             * 等切面锁的微任务执行完才重新初始化锁
             */
            this.isRefreshing = false
            this.promiseLock = new Promise((resolve, reject) => {
              this.triggerResolveLock = resolve
              this.triggerRejectLock = reject
            })
          }, 0)
        }
        return response.data
      },
      (error: PHttpError) => {
        const $error = error
        $error.isCancelRequest = Axios.isCancel($error)
        /**
         * 所有的响应异常 区分来源为取消请求/非取消请求
         * 非取消请求/非重置token请求在401 会自动再次发起请求
         */
        if (
          $error?.response?.status === 401 &&
          !$error.isCancelRequest &&
          !isReset($error?.config?.url)
        ) {
          this.isExpired = true
          return SAxios.axiosInstance.request(Object.assign($error.config!))
        }
        ElNotification({
          title: error.code,
          message: error.message,
          type: 'error'
        })
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
