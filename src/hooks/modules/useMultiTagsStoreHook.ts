import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

export const useMultiTagsStoreHook = createGlobalState(() => {
  const initData: RouteLocationNormalizedLoaded[] = []
  const multiTags = useStorage('tag-store', initData, sessionStorage)

  /**
   * tag CURD
   */
  async function SET_TAG(payload: RouteLocationNormalizedLoaded) {
    const hasTag = multiTags.value.some((row) => row.fullPath === payload.fullPath)
    if (!hasTag) {
      const payloadRaw = { ...toRaw(payload) }
      Reflect.deleteProperty(payloadRaw, 'matched')
      Reflect.deleteProperty(payloadRaw, 'redirectedFrom')
      multiTags.value.push(payloadRaw)
    }
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
  return { multiTags, SET_TAG, DEL_TAG, CLEAN_TAG, DEL_OTHERS_TAG }
})
