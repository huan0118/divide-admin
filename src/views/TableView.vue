<template>
  <de-responsibility v-model="val" placeholder="切换岗位职能" :clearable="true"></de-responsibility>
  <el-table :data="tableData" stripe style="width: 100%">
    <el-table-column prop="date" label="Date" width="180" />
    <el-table-column prop="name" label="Name" width="180" />
    <el-table-column prop="address" label="Address" />
  </el-table>
</template>

<script lang="ts" setup>
  /**
   * 获取职能id的时机
   */
  const val = ref('')
  console.log('宏任务=>', val.value)

  watch(
    () => val.value,
    () => {
      console.log('watch=>', val.value)
    }
  )

  Promise.resolve().then(() => {
    console.log('微任务=>', val.value)
  })

  watchEffect(() => {
    console.log('watchEffect=>', val.value)
  })

  onMounted(() => {
    console.log('onMounted=>', val.value)
  })
  const tableData = [
    {
      date: '2016-05-03',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-02',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-04',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    },
    {
      date: '2016-05-01',
      name: 'Tom',
      address: 'No. 189, Grove St, Los Angeles'
    }
  ]
</script>
