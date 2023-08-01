<!-- eslint-disable vue/valid-v-for -->
<template>
  <div class="sidebar-container">
    <el-scrollbar>
      <el-menu :default-active="active" class="el-menu-vertical" router>
        <sub-menu v-for="item in props.tree" :key="route.path" :node="item" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import SubMenu from './SubMenu.vue'

  const props = defineProps<{
    tree: MenuTreeInfo
  }>()
  const route = useRoute()
  const active = computed(() => String(route.meta.menuId))
</script>
