<template>
  <div class="shadow-lg">
    <el-scrollbar ref="scrollbarRef">
      <div class="flex p-1" ref="innerRef">
        <router-link
          v-for="tag in multiTags"
          :key="tag.fullPath"
          active-class="active"
          :to="tag"
          custom
          v-slot="{ navigate }"
        >
          <span
            before=""
            class="relative cursor-pointer shrink-0 flex justify-center items-center h-6 ml-1 mr-1 text-xs border border-slate-800/40 p-1 px-2"
            :class="
              isActive(tag)
                ? 'text-white bg-regal-black/90 before:content-[attr(before)] before:bg-white before:w-2 before:h-2 before:rounded-full before:mr-1'
                : ''
            "
            @contextmenu.prevent="openMenu(tag, $event)"
            @click="navigate"
          >
            {{ tag?.meta?.title }}
          </span>
        </router-link>
      </div>
    </el-scrollbar>

    <ul
      v-show="visible"
      class="absolute bg-white z-50 shadow-md py-2 text-sm rounded"
      :style="{ left: position.left + 'px', top: position.top + 'px' }"
    >
      <li
        class="px-4 h-8 cursor-pointer leading-8 hover:bg-black/40 hover:text-white"
        @click="refreshSelectedTag(position.selectedTag!)"
        >刷新</li
      >
      <li
        class="px-4 h-8 cursor-pointer leading-8 hover:bg-black/40 hover:text-white"
        v-if="isAffix(position.selectedTag!)"
        @click="closeSelectedTag(position.selectedTag!)"
      >
        关闭当前
      </li>
      <li
        class="px-4 h-8 cursor-pointer leading-8 hover:bg-black/40 hover:text-white"
        @click="closeOthersTags"
        >关闭其他</li
      >
      <li
        class="px-4 h-8 cursor-pointer leading-8 hover:bg-black/40 hover:text-white"
        @click="closeAllTags()"
        >关闭所有</li
      >
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { RouteLocationNormalizedLoaded } from 'vue-router'
  import type { tagsPositionType } from '~/types/helper'
  import { useMultiTagsStoreHook } from '@/hooks/modules/useMultiTagsStoreHook'
  import type { ElScrollbar } from 'element-plus'
  import type { RemovableRef } from '@vueuse/core'

  const { multiTags, CHANGE_TAG, CLEAN_TAG, DEL_OTHERS_TAG, DEL_TAG } = useMultiTagsStoreHook()
  const route = useRoute()
  const { currentRoute, replace, push } = useRouter()

  /** 是否隐藏contextmenu，默认隐藏 */
  const visible = ref(false)

  const innerRef = ref<HTMLDivElement>()
  const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

  watchEffect(() => {
    if (visible.value) {
      document.body.addEventListener('click', closeMenu)
    } else {
      document.body.removeEventListener('click', closeMenu)
    }
  })
  onMounted(() => {
    addTags()
  })

  watch(
    () => route.fullPath,
    () => {
      addTags()
    }
  )

  const position = reactive<tagsPositionType>({
    left: 0,
    top: 0,
    selectedTag: null
  })

  function addTags() {
    const { meta } = route
    if (meta?.affix) {
      CHANGE_TAG(currentRoute.value)
    }
  }
  function closeAllTags() {
    CLEAN_TAG()
    nextTick(() => {
      replace('/')
    })
  }

  function closeOthersTags() {
    if (!isActive(position.selectedTag!)) {
      push(position.selectedTag!)
    }
    DEL_OTHERS_TAG(position.selectedTag!)
  }

  function closeSelectedTag(view: RouteLocationNormalizedLoaded) {
    const multiTags = DEL_TAG(view)
    if (isActive(view)) {
      toLastView(multiTags, view)
    }
  }

  function toLastView(
    multiTags: RemovableRef<RouteLocationNormalizedLoaded[]>,
    view: RouteLocationNormalizedLoaded
  ) {
    const latestView = multiTags.value.slice(-1)[0]
    if (latestView) {
      push(latestView.fullPath)
    } else {
      if (view.name === 'Dashboard') {
        const { query, fullPath } = view
        replace({ path: '/redirect' + fullPath, query })
      } else {
        push('/')
      }
    }
  }

  function refreshSelectedTag(view: RouteLocationNormalizedLoaded) {
    CLEAN_TAG()
    const { query, fullPath } = view
    nextTick(() => {
      replace({
        path: '/redirect' + fullPath,
        query
      })
    })
  }

  function closeMenu() {
    visible.value = false
  }

  function isActive(tag: RouteLocationNormalizedLoaded) {
    return tag.fullPath === route.fullPath
  }
  function isAffix(tag: RouteLocationNormalizedLoaded) {
    return tag && tag.meta && tag.meta.affix
  }

  function openMenu(tag: RouteLocationNormalizedLoaded, e: MouseEvent) {
    const menuMinWidth = 105
    const offsetWidth = innerRef.value!.offsetWidth // container width
    const maxLeft = offsetWidth - menuMinWidth // left boundary
    const left = e.clientX + 10 // 15: margin right

    if (left > maxLeft) {
      position.left = maxLeft
    } else {
      position.left = left
    }

    position.top = e.clientY
    position.selectedTag = tag
    visible.value = true
  }
</script>
