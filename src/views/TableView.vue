<template>
  <de-responsibility placeholder="切换岗位职能"></de-responsibility>

  <!-- <el-table :data="tableData" :border="true" v-loading="isLoading" class="w-full md:w-auto mt-6">
    <el-table-column prop="name" label="Name" width="120" />
    <el-table-column prop="from" label="From" width="120" />
    <el-table-column prop="email" label="Email" />
    <el-table-column prop="address" label="Address" />
    <el-table-column prop="string" label="star" width="120" />
    <el-table-column fixed="right" label="Operations" width="120">
      <template #default="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.row)">Edit</el-button>
      </template>
    </el-table-column>
  </el-table> -->

  <el-input v-model="val"></el-input>
</template>

<script lang="ts" setup>
import { useAsyncState } from '@vueuse/core'
import { getListApi } from '@/api/table'
import type { ListInfo } from '~/types/api'
defineOptions({
  name: 'TableView'
})
/**
 * 通常情况下，我们使用当前职能id去获取当前职能对映的表单信息，然后渲染到页面上
 */
const { currentRoute, push } = useRouter()

const { _permissions } = currentRoute.value.meta

const val = ref('')
onActivated(() => {
  // 调用时机为首次挂载
  // 以及每次从缓存中被重新插入时
  console.log('onActivated jobId => ', _permissions?.jobName!)
})

onDeactivated(() => {
  // 在从 DOM 上移除、进入缓存
  // 以及组件卸载时调用
  console.log('onDeactivated jobId => ', _permissions?.jobName!)
})
onMounted(() => {
  setTimeout(() => {
    console.log('onMounted jobId => ', _permissions?.jobId!)
  }, 8000)
})

const handleEdit = (row: ListInfo) => {
  push({
    name: 'EditTable',
    params: { id: row.id },
    query: { jobId: _permissions?.jobId! }
  })
}

const { state: tableData, isLoading } = useAsyncState(
  getListApi({
    jobId: _permissions?.jobId!,
    jobName: _permissions?.jobName!
  }),
  []
)
</script>
