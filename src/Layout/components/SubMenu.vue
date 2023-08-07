<template>
  <div v-if="allChildHidden(props.node)" class="menu-wrap">
    <template v-if="hasOneShowingChild(props.node.children)">
      <el-menu-item :index="String(props.node.menuId)" :route="resolveTo(props.node)">
        <template #title>
          {{ props.node.menuName }}
        </template>
      </el-menu-item>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="String(props.node.menuId)" teleported>
      <template #title>
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
  import { userPermissionHook } from '@/hooks/modules/userPermissionHook'
  const router = useRouter()
  const { routeMap } = userPermissionHook()
  const props = defineProps<{
    node: Readonly<TreeInfo>
  }>()

  function resolveTo(data: MenuRow) {
    if (isExternal(data.httpUrl)) {
      return data.httpUrl
    } else {
      return router.resolve(routeMap.get(data.menuId) ?? '/notFoundPath')
    }
  }

  function hasOneShowingChild(children: TreeInfo[] = []) {
    if (!children || !children.length) {
      return true
    }
    return false
  }

  function allChildHidden(node: TreeInfo) {
    if (node.children) {
      return !!node.children.some((row) => !row.hidden)
    }
    return !node.hidden
  }
</script>
