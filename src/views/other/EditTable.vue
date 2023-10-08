<template>
  <el-form :model="form" label-width="120px">
    <el-form-item label="Activity name">
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item label="Activity zone">
      <el-select v-model="form.region" placeholder="please select your zone">
        <el-option label="Zone one" value="shanghai" />
        <el-option label="Zone two" value="beijing" />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="onSubmit">Create</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue'
  const { currentRoute } = useRouter()
  const { jobId } = currentRoute.value.query
  const { id } = currentRoute.value.params
  const form = reactive({
    name: '',
    region: ''
  })
  //currentRoute 为全局单例对象 注意取值
  const onSubmit = () => {
    setTimeout(() => {
      console.log('jobId-1 => ', currentRoute.value.query.jobId)
      console.log('form id-1 =>', currentRoute.value.params.id)

      console.log('jobId-2 => ', jobId)
      console.log('form id-2 =>', id)
    }, 10000)
  }
</script>
