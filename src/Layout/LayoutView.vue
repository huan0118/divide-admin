<template>
  <el-container class="app-wrapper">
    <el-aside class="app-aside">
      <menu-tree :tree="dynamicMenu" />
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <nav-bar></nav-bar>
        <!-- <TagsView></TagsView> -->
      </el-header>
      <el-main class="main-container">
        <el-scrollbar>
          <div class="main-box">
            <router-view :key="$route.fullPath"></router-view>
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import MenuTree from './components/MenuTree.vue'
  import NavBar from './NavBar.vue'
  import { userPermissionHook } from '@/hooks/modules/userPermissionHook'
  const { dynamicMenu } = userPermissionHook()
</script>

<style lang="scss" scoped></style>
