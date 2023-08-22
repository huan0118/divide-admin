<template>
  <div class="HomeView">
    <h1>This is an HomeView page</h1>
  </div>
  <de-responsibility placeholder="切换岗位职能"></de-responsibility>
  <div>
    {{ _permissions?.resources[0].resource }}
  </div>
</template>

<script lang="ts" setup>
  const { currentRoute } = useRouter()
  const { _permissions } = currentRoute.value.meta
</script>
