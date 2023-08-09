<template>
  <div class="TagsView">
    <el-scrollbar ref="scrollbarRef">
      <div class="scrollbar-flex-content" ref="innerRef">
        <router-link
          v-for="tag in multiTags"
          :key="tag.fullPath"
          active-class="active"
          :to="tag"
          custom
          v-slot="{ navigate }"
        >
          <span
            class="tags-view-item"
            :class="isActive(tag) ? 'active' : ''"
            @contextmenu.prevent="openMenu(tag, $event)"
            @click="navigate"
          >
            {{ tag?.meta?.title || tag.path }}
          </span>
        </router-link>
      </div>
    </el-scrollbar>

    <ul
      v-show="visible"
      class="contextmenu"
      :style="{ left: position.left + 'px', top: position.top + 'px' }"
    >
      <li @click="refreshSelectedTag(position.selectedTag!)">刷新</li>
      <li v-if="isAffix(position.selectedTag!)" @click="closeSelectedTag(position.selectedTag!)">
        关闭当前
      </li>
      <li @click="closeOthersTags">关闭其他</li>
      <li @click="closeAllTags()">关闭所有</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import type { RouteLocationNormalizedLoaded } from 'vue-router'
  import type { tagsPositionType } from './types'
  import { useMultiTagsStoreHook } from '@/hooks/modules/useMultiTagsStoreHook'
  import type { ElScrollbar } from 'element-plus'
  import type { RemovableRef } from '@vueuse/core'

  const { multiTags, SET_TAG, CLEAN_TAG, DEL_OTHERS_TAG, DEL_TAG } = useMultiTagsStoreHook()
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
      SET_TAG(currentRoute.value)
    }
  }
  function closeAllTags() {
    CLEAN_TAG()
  }

  function closeOthersTags() {
    if (!isActive(position.selectedTag!)) {
      push(position.selectedTag!)
    }
    DEL_OTHERS_TAG(position.selectedTag!)
  }

  function closeSelectedTag(view: RouteLocationNormalizedLoaded) {
    console.log(position)
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

<style lang="scss" scoped>
  .TagsView {
    border-bottom: 1px solid #eee;
  }
  .scrollbar-flex-content {
    display: flex;

    .tags-view-item {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-color-danger-light-9);
      color: var(--el-color-danger);

      position: relative;
      cursor: pointer;
      height: 22px;
      line-height: 22px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      margin-bottom: 4px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: #181e34;
        color: #fff;
        border-color: #fff;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 0px 0px 4px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      height: 30px;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
</style>
