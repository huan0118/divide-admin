<template>
  <div v-if="props.node" class="menu-wrap">
    <template v-if="hasOneShowingChild(props.node.children)">
      <el-menu-item :index="String(props.node.menuId)" :route="resolveTo(props.node)">
        <template #title>
          <i-ep-location />
          {{ props.node.menuName }}
        </template>
      </el-menu-item>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="String(props.node.menuId)" teleported>
      <template #title>
        <!-- <svg-icon v-if="props.node.icon" :icon-class="props.node.icon" /> -->
        {{ props.node.menuName }}
      </template>
      <sub-menu
        v-for="child in props.node.children"
        :key="child.menuId"
        :node="child"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
  import { isExternal } from '@/utils/validate'
  // const router = useRouter()
  const props = defineProps<{
    node: Readonly<TreeInfo>
  }>()

  function resolveTo(data: MenuRow) {
    if (isExternal(data.httpUrl)) {
      return data.httpUrl
    }
  }

  function hasOneShowingChild(children: TreeInfo[] = []) {
    if (!children.length) {
      return true
    }
    return false
  }
</script>
