import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'

export const useLocalMenuActive = createGlobalState(() => {
  /**
   * 当前激活的左侧菜单
   */
  const localMenuActive = useStorage<number>('local-menu-active', NaN, sessionStorage)
  const localAffixActive = useStorage<string>('local-affix-active', '', sessionStorage)
  const localEndActiveType = useStorage<'nav' | 'affix' | ''>(
    'local-end-active-type',
    '',
    sessionStorage
  )

  function CHANGE_LOCAL_ACTIVE(type: 'nav' | 'affix', payload: string | number) {
    console.log('CHANGE_LOCAL_ACTIVE', type, payload)
    if (type === 'nav') {
      localMenuActive.value = payload as number
    } else if (type === 'affix') {
      console.log(payload)
      localAffixActive.value = payload as string
    }

    localEndActiveType.value = type
  }

  return { localMenuActive, localAffixActive, localEndActiveType, CHANGE_LOCAL_ACTIVE }
})
