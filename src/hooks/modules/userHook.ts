import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'
import type { UserInfo } from '~/types/user'
import { getLogin, logout } from '@/api/user'

export const useUserStoreHook = createGlobalState(() => {
  /**
   * 登入用户信息的CURD
   */
  const initData = {
    accessToken: '',
    userId: '',
    username: '',
    email: '',
    avatar: '',
    desc: ''
  }
  const userInfo = useStorage<UserInfo>('user-store', initData, sessionStorage)

  async function GET_USER_INFO(payload?: object) {
    const res = await getLogin(payload)
    userInfo.value = res.data
  }

  async function LOGOUT() {
    await logout()
  }
  function UPDATE_USER_INFO(data: UserInfo) {
    userInfo.value = data
  }
  function DEL_USER_INFO() {
    userInfo.value = initData
  }

  return { userInfo, GET_USER_INFO, UPDATE_USER_INFO, DEL_USER_INFO, LOGOUT }
})
