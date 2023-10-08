<template>
  <de-responsibility placeholder="切换岗位职能"></de-responsibility>

  <div
    class="mx-auto max-w-xl bg-white shadow-xl p-8 text-slate-700 text-sm leading-6 sm:text-base sm:leading-7 dark:bg-slate-800 dark:text-slate-400"
  >
    配置型权限资源获取:
    {{ _permissions?.resources[0].resource }}
  </div>
</template>

<script lang="ts" setup>
  const { currentRoute } = useRouter()
  const { _permissions } = currentRoute.value.meta

  console.log('other page jobId => ', _permissions?.jobId!)
</script>
