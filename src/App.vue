<script setup lang="ts">
  import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
  const locale = zhCn
  const zIndex = 3000
  const size = 'small'
</script>

<template>
  <el-config-provider :locale="locale" :size="size" :z-index="zIndex">
    <router-view />
  </el-config-provider>
</template>
