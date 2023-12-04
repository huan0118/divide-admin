<script setup lang="ts">
defineOptions({
  name: 'redirect'
})
const { currentRoute, replace } = useRouter()

const { params, query } = unref(currentRoute)
const { path } = params

const _path = Array.isArray(path) ? path.join('/') : path

replace({
  path: '/' + _path,
  query
})
</script>

<template>
  <div></div>
</template>
