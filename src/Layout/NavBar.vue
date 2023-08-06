<template>
  <section class="Navbar">
    <div class="right-menu">
      <span class="name">{{ name }}</span>
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          ></el-avatar>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="logout">退出登入</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { useUserStoreHook } from '@/hooks/modules/userHook'
  const router = useRouter()
  const { LOGOUT, user } = useUserStoreHook()

  const handleCommand = (command: string) => {
    switch (command) {
      case 'logout':
        LOGOUT()
          .then(() => {
            router.replace({ name: 'Login' })
          })
          .catch((err) => {
            console.warn(err)
          })
        break

      default:
        break
    }
  }
  const name = computed(() => user.username)
</script>
