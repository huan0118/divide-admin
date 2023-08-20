<template>
  <el-container class="app-wrapper">
    <el-aside class="app-aside">
      <menu-tree :tree="dynamicMenu" />
    </el-aside>

    <el-container>
      <el-header class="app-header">
        <nav-bar></nav-bar>
        <tags-view></tags-view>
      </el-header>
      <el-main class="main-container">
        <el-scrollbar>
          <div class="main-box">
            <router-view v-slot="{ Component }" :key="$route.fullPath">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
            <!-- <router-view :key="$route.fullPath"></router-view> -->
          </div>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
  import MenuTree from './components/MenuTree.vue'
  import NavBar from './components/NavBar.vue'
  import TagsView from './components/TagsView.vue'
  import { userPermissionHook } from '@/hooks/modules/userPermissionHook'
  const { dynamicMenu } = userPermissionHook()
</script>

<style>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
