<template>
  <de-responsibility placeholder="切换岗位职能"></de-responsibility>

  <div class="">
    {{ _permissions!.jobName }}
  </div>

  <div>
    {{ _permissions!.resources![0].resource }}
  </div>
</template>

<script lang="ts" setup>
  const { currentRoute } = useRouter()
  const { _permissions } = currentRoute.value.meta
</script>
