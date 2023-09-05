import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export const useMultiTagsStoreHook = createGlobalState(() => {
  const initData: RouteLocationNormalizedLoaded[] = []
  const multiTags = useStorage('tag-store', initData, sessionStorage)
  const localAffixActive = useStorage('local-affix-active', 0, sessionStorage)

  /**
   * tag CURD
   */
  async function CHANGE_TAG(payload: RouteLocationNormalizedLoaded) {
    const index = multiTags.value.findIndex((row) => row.fullPath === payload.fullPath)

    const payloadRaw = { ...toRaw(payload) }
    Reflect.deleteProperty(payloadRaw, 'matched')
    Reflect.deleteProperty(payloadRaw, 'redirectedFrom')

    if (index != -1) {
      multiTags.value.splice(index, 1, payloadRaw)
    } else {
      multiTags.value.push(payloadRaw)
    }

    localAffixActive.value = payloadRaw.meta._cid
  }

  function DEL_TAG(payload: RouteLocationNormalizedLoaded) {
    const idx = multiTags.value.findIndex((row) => row.fullPath === payload.fullPath)
    multiTags.value.splice(idx, 1)
    return multiTags
  }

  function CLEAN_TAG() {
    multiTags.value = []
  }

  function DEL_OTHERS_TAG(payload: RouteLocationNormalizedLoaded) {
    const popItem = multiTags.value.find((row) => row.fullPath === payload.fullPath)
    if (popItem) {
      multiTags.value = []
      multiTags.value.push(popItem)
    }
  }
  return { multiTags, localAffixActive, CHANGE_TAG, DEL_TAG, CLEAN_TAG, DEL_OTHERS_TAG }
})
