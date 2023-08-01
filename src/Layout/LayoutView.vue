<template>
  <el-container>
    <el-aside>
      <menu-tree :tree="menuInfo" />
    </el-aside>

    <el-container>
      <el-header height="50px">
        <nav-bar></nav-bar>
        <!-- <TagsView></TagsView> -->
      </el-header>
      <el-main class="main-box">
        <el-scrollbar>
          <div class="wrap-box">
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
  const { menuInfo } = userPermissionHook()
</script>

<style lang="scss" scoped></style>
