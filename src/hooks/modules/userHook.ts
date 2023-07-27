import { computed, ref, unref } from 'vue'
import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'
import type { UserInfo } from '~/types/store'
import { getLogin } from '@/api/user'

export const useUserStoreHook = createGlobalState(() => {
  // state
  const initData = {
    accessToken: '',
    userId: '',
    username: '',
    realName: '',
    avatar: '',
    desc: ''
  }
  const userInfo = useStorage<UserInfo>('user-store', initData, sessionStorage)
  // const userInfo = ref<UserInfo>(initData)

  /**
   * 登入 CURD
   */
  const user = computed(() => unref(userInfo))
  console.log(user)

  async function GetUserInfo(payload?: object) {
    const res = await getLogin(payload)
    userInfo.value = res.data
  }
  function UpdateUserInfo(data: UserInfo) {
    userInfo.value = data
  }
  function DeleteUserInfo() {
    for (const [key, _] of Object.entries(initData)) {
      // @ts-ignore
      userInfo.value[key] = ''
    }
  }

  return { userInfo, user, GetUserInfo, UpdateUserInfo, DeleteUserInfo }
})
