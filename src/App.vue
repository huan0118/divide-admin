<script setup lang="ts">
  import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
  const locale = zhCn
  const zIndex = 3000
</script>

<template>
  <el-config-provider :locale="locale" size="small" :z-index="zIndex">
    <router-view />
  </el-config-provider>
</template>
