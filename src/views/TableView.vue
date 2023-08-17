<template>
  <de-responsibility
    v-model="responsibility"
    placeholder="切换岗位职能"
    :clearable="true"
  ></de-responsibility>
</template>

<script lang="ts" setup>
  /**
   *
   * 获取职能id的时机
   */

  const responsibility = ref('')
  console.log('宏任务=>', responsibility.value)

  watch(
    () => responsibility.value,
    () => {
      console.log('watch=>', responsibility.value)
    }
  )

  Promise.resolve().then(() => {
    console.log('微任务=>', responsibility.value)
  })

  watchEffect(() => {
    console.log('watchEffect=>', responsibility.value)
  })

  onMounted(() => {
    console.log('onMounted=>', responsibility.value)
  })
</script>
