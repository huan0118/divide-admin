<template>
  <div class="h-full shadow-xl">
    <el-scrollbar>
      <el-menu :default-active="active" class="scrollbar-menu-vertical" unique-opened router>
        <sub-menu v-for="item in props.tree" :key="item.menuId" :node="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import SubMenu from './SubMenu.vue'
  import { useLocalMenuActive } from '@/hooks/modules/useLocalMenuActive'
  const props = defineProps<{
    tree: MenuTreeInfo
  }>()
  const { currentRoute } = useRouter()
  const { localMenuActive, CHANGE_LOCAL_ACTIVE } = useLocalMenuActive()

  const active = computed(() => String(localMenuActive.value))

  watch(
    () => currentRoute.value.fullPath,
    () => {
      if (currentRoute.value.meta.menuId) {
        CHANGE_LOCAL_ACTIVE('nav', currentRoute.value.meta.menuId)
      } else if (currentRoute.value.meta.affix || currentRoute.value.meta.allAffix) {
        CHANGE_LOCAL_ACTIVE('affix', currentRoute.value.fullPath)
      }
    },
    {
      immediate: true
    }
  )
</script>
