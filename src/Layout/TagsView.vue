<template>
  <div class="TagsView" ref="tagRoot">
    <el-scrollbar>
      <div class="scrollbar-flex-content">
        <router-link
          v-for="(tag, index) in visitedViews"
          :key="index"
          active-class="active"
          :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
          custom
          v-slot="{ navigate }"
        >
          <span
            class="tags-view-item"
            :class="isActive(tag) ? 'active' : ''"
            @contextmenu.prevent="openMenu(tag, $event)"
            @click="navigate"
          >
            {{ tag.title }}
          </span>
        </router-link>
      </div>
    </el-scrollbar>

    <ul
      v-show="visible"
      class="contextmenu"
      :style="{ left: position.left + 'px', top: position.top + 'px' }"
    >
      <li @click="refreshSelectedTag(position.selectedTag)">Refresh</li>
      <li v-if="!isAffix(position.selectedTag)" @click="closeSelectedTag(position.selectedTag)">
        Close
      </li>
      <li @click="closeOthersTags">Close Others</li>
      <li @click="closeAllTags(position.selectedTag)">Close All</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watchEffect, reactive, watch, nextTick, unref } from 'vue'
  import { useStore } from 'vuex'
  import { useRoute, useRouter } from 'vue-router'
  import { extendsOwnPropertyPrimitive, simpleResolve } from '@/utils/index'
  const route = useRoute()
  const store = useStore()

  const visitedViews = computed(() => store.state.tagsView.visitedViews)
  const routes = computed(() => store.state.permission.addRoutes)
  const router = useRouter()
  const visible = ref(false)
  console.log(router, 'router')
  const tagRoot = ref(null)

  watchEffect(() => {
    if (visible.value) {
      document.body.addEventListener('click', closeMenu)
    } else {
      document.body.removeEventListener('click', closeMenu)
    }
  })
  onMounted(() => {
    initTags()
    addTags()
  })

  watch(
    () => route.fullPath,
    () => {
      addTags()
    }
  )
  const position = reactive({
    left: 0,
    top: 0,
    selectedTag: null
  })

  let Tags = []

  function filterAffixTags(routes, basePath = '/') {
    let tags = []
    let tagPath
    routes.forEach((route) => {
      if (route.meta && route.meta.affix) {
        tagPath = simpleResolve(basePath, route.path)
        tags.push({
          fullPath: tagPath,
          path: route.path,
          name: route.name,
          query: extendsOwnPropertyPrimitive(route.query),
          meta: extendsOwnPropertyPrimitive(route.meta)
        })
      }
      if (route.children) {
        const tempTags = filterAffixTags(route.children, tagPath)
        if (tempTags.length >= 1) {
          tags = [...tags, ...tempTags]
        }
      }
    })
    return tags
  }
  function initTags() {
    const affixTags = (Tags = filterAffixTags(routes.value))
    for (const tag of affixTags) {
      // Must have tag name
      if (tag.name) {
        store.dispatch('tagsView/addVisitedView', tag)
      }
    }
  }
  function addTags() {
    const { name } = route
    if (name) {
      store.dispatch('tagsView/addView', route)
    }
    return false
  }
  function closeAllTags(view) {
    store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
      if (Tags.some((tag) => tag.fullPath === view.fullPath)) {
        return
      }
      toLastView(visitedViews, view)
    })
  }

  function closeOthersTags() {
    if (!isActive(position.selectedTag)) {
      router.push(position.selectedTag)
    }
    store.dispatch('tagsView/delOthersViews', position.selectedTag).then(() => {
      moveToCurrentTag(position.selectedTag)
    })
  }

  function moveToCurrentTag(view) {
    store.dispatch('tagsView/updateVisitedView', view)
  }

  function closeSelectedTag(view) {
    console.log(unref(position), position)
    store.dispatch('tagsView/delView', view).then(({ visitedViews }) => {
      if (isActive(view)) {
        toLastView(visitedViews, view)
      }
    })
  }

  function toLastView(visitedViews, view) {
    const latestView = visitedViews.slice(-1)[0]
    if (latestView) {
      router.push(latestView.fullPath)
    } else {
      if (view.name === 'Dashboard') {
        const { query, fullPath } = view
        router.replace({ path: '/redirect' + fullPath, query })
      } else {
        router.push('/')
      }
    }
  }

  function refreshSelectedTag(view) {
    store.dispatch('tagsView/delCachedView', view).then(() => {
      const { query, fullPath } = view
      nextTick(() => {
        router.replace({
          path: '/redirect' + fullPath,
          query
        })
      })
    })
  }

  function closeMenu() {
    visible.value = false
  }

  function isActive(tag) {
    return tag.fullPath === route.fullPath
  }
  function isAffix(tag) {
    return tag && tag.meta && tag.meta.affix
  }

  function openMenu(tag, e) {
    const menuMinWidth = 105
    // const offsetLeft = tagRoot.value.getBoundingClientRect().left; // container margin left
    const offsetWidth = tagRoot.value.offsetWidth // container width
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
