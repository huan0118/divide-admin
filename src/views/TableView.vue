<template>
  <de-responsibility placeholder="切换岗位职能"></de-responsibility>

  <div class="subpixel-antialiased"> 当前职能{{ _permissions!.jobName }} </div>

  <h4>当前职能应该展示的Text</h4>
  <div class="underline"> {{ _permissions!.resources![0].resource }} </div>
</template>

<script lang="ts" setup>
  const { currentRoute } = useRouter()
  const { _permissions } = currentRoute.value.meta
</script>
