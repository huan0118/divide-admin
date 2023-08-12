import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'

export const useLocalMenuActive = createGlobalState(() => {
  /**
   * 当前激活的菜单
   */
  const localMenuActive = useStorage('local-menu-active', '', sessionStorage)

  function CHANGE_LOCAL_ACTIVE(payload?: string) {
    localMenuActive.value = payload || ''
  }

  return { localMenuActive, CHANGE_LOCAL_ACTIVE }
})
