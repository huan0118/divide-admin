<template>
  <div class="sidebar-container">
    <el-scrollbar>
      <el-menu
        :default-active="localMenuActive"
        class="el-menu-vertical"
        unique-opened
        router
        @select="handleSelect"
      >
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
  const { localMenuActive, CHANGE_LOCAL_ACTIVE } = useLocalMenuActive()

  if (!localMenuActive.value) {
    const { currentRoute } = useRouter()
    CHANGE_LOCAL_ACTIVE(String(currentRoute.value.meta.menuId!))
  }

  function handleSelect(index: string) {
    CHANGE_LOCAL_ACTIVE(index)
  }
</script>
