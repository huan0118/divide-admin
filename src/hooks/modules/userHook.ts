import { unref } from 'vue'
import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'
import type { UserInfo } from '~/types/user'
import { getLogin, logout } from '@/api/user'

export const useUserStoreHook = createGlobalState(() => {
  // state
  const initData = {
    accessToken: '',
    userId: '',
    username: '',
    email: '',
    avatar: '',
    desc: ''
  }
  const userInfo = useStorage<UserInfo>('user-store', initData, sessionStorage)

  /**
   * 登入 CURD
   */
  const user = unref(userInfo)
  console.log(user, userInfo)
  async function GET_USER_INFO(payload?: object) {
    const res = await getLogin(payload)
    userInfo.value = res.data
  }

  async function LOGOUT() {
    await logout()
    DEL_USER_INFO()
  }
  function UPDATE_USER_INFO(data: UserInfo) {
    userInfo.value = data
  }
  function DEL_USER_INFO() {
    for (const [key, _] of Object.entries(initData)) {
      // @ts-ignore
      userInfo.value[key] = ''
    }
  }

  return { userInfo, user, GET_USER_INFO, UPDATE_USER_INFO, DEL_USER_INFO, LOGOUT }
})
