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

  const form = reactive({
    name: '',
    region: ''
  })

  const onSubmit = () => {
    console.log('submit!')
  }
</script>
