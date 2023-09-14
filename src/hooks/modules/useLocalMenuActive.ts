import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'

export const useLocalMenuActive = createGlobalState(() => {
  /**
   * 当前激活的左侧菜单
   */
  const localMenuActive = useStorage('local-menu-active', 0, sessionStorage)
  const localAffixActive = useStorage('local-affix-active', 0, sessionStorage)
  const localEndActiveType = useStorage('local-end-active-type', '', sessionStorage)

  function CHANGE_LOCAL_ACTIVE(type: 'nav' | 'affix', payload: number) {
    if (type === 'nav') {
      localMenuActive.value = payload
    } else if (type === 'affix') {
      localAffixActive.value = payload
    }

    localEndActiveType.value = type
  }

  return { localMenuActive, localAffixActive, localEndActiveType, CHANGE_LOCAL_ACTIVE }
})
