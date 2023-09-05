import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'

export const useLocalMenuActive = createGlobalState(() => {
  /**
   * 当前激活的左侧菜单
   */
  const localMenuActive = useStorage('local-menu-active', 0, sessionStorage)

  function CHANGE_LOCAL_ACTIVE(payload?: number) {
    if (payload) {
      localMenuActive.value = payload
    }
  }

  return { localMenuActive, CHANGE_LOCAL_ACTIVE }
})
