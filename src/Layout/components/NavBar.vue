<template>
  <section class="app-navbar">
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
  import { resetRouter } from '@/router/index'
  import { userPermissionHook } from '@/hooks/modules/userPermissionHook'
  const { CLEAN_DYNAMIC_MENU_DATA } = userPermissionHook()
  const { LOGOUT, userInfo, DEL_USER_INFO } = useUserStoreHook()
  const router = useRouter()

  async function logout() {
    await LOGOUT()
    resetRouter()
    DEL_USER_INFO()
    CLEAN_DYNAMIC_MENU_DATA()
    router.replace({ name: 'Login' })
  }

  const handleCommand = (command: string) => {
    switch (command) {
      case 'logout':
        logout()
        break

      default:
        break
    }
  }
  const name = computed(() => userInfo.value.username)
</script>
