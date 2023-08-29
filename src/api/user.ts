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

/**
 * 
   前端测试 promiseLock 代码参考

   import { expire } from '@/api/user'

  function handleTest() {
    for (let index = 1000; index < 2000; index++) {
      testExpire(index)
    }
  }

  async function testExpire(idx: number) {
    const res = await expire(idx)
    console.log(res)
  }

  for (let index = 0; index < 1000; index++) {
    testExpire(index)
  }

 * 后端测试promiseLock代码参考
 * 
 * function getUuid () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0
        const v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
    })
  }
  let code = 200

  let refreshTime = Date.now()

  router.get('/expire', async (ctx, next) => {
      if (code === 200) {
          const now = Date.now()
          if (now - refreshTime > 6000) {
              const num = Math.floor(Math.random() * 100)
              if (num > 80) {
                  code = 401
              }
          }else{
            console.log('token not expire')
          }

      }
      ctx.status = code
      ctx.body = {
          code,
          _req: ctx.query
      }
  })

  router.get('/refreshToken', async (ctx, next) => {
      code = 200
      refreshTime = Date.now()
      ctx.status = code
      ctx.body = {
          code: code,
          data: {
              accessToken: getUuid()
          }
      }
  })
 */

/** 刷新token */
export const refreshTokenApi = () => {
  return http.request<RefreshTokenResult>('get', '/refreshToken')
}
