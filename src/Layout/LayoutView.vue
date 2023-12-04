<template>
  <div class="flex h-screen overflow-hidden">
    <div class="flex-none basis-52">
      <menu-tree :tree="dynamicMenu" />
    </div>
    <div class="flex-1 max-h-screen">
      <nav-bar></nav-bar>
      <tags-view></tags-view>
      <div class="border-box p-1" style="height: calc(100vh - 75px)">
        <el-scrollbar>
          <!-- <router-view :key="$route.fullPath"></router-view> -->
          <router-view v-slot="{ Component }">
            <keep-alive :exclude="[/^redirect/]">
              <component :is="Component" />
            </keep-alive>
          </router-view>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuTree from './components/MenuTree.vue'
import NavBar from './components/NavBar.vue'
import TagsView from './components/TagsView.vue'
import { userPermissionHook } from '@/hooks/modules/userPermissionHook'
const { dynamicMenu } = userPermissionHook()
</script>
