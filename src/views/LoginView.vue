<template>
  <div
    class="h-screen flex min-h-full flex-1 flex-col justify-center bg-[url('../assets/basketball.svg')]"
  >
    <section class="w-96 mx-auto p-6 bg-regal-black/10 shadow-regal-grey/40 shadow">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <de-icon
          class="mx-auto text-regal-grey/80 text-4xl animate-pulse"
          icon="tabler:ball-basketball"
        />
        <h2 class="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900"
          >Sign in to your account</h2
        >
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div class="space-y-6">
          <div>
            <label for="userName" class="block text-sm font-medium leading-6 text-gray-900"
              >userName</label
            >
            <div class="mt-2">
              <input
                v-model="formData.userName"
                id="userName"
                name="userName"
                type="text"
                autocomplete="userName"
                required="true"
                class="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm outline-0 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label for="password" class="block text-sm font-medium leading-6 text-gray-900"
                >Password</label
              >
            </div>
            <div class="mt-2">
              <input
                v-model="formData.pwd"
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                required="true"
                class="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-gray-300 placeholder:text-gray-400 outline-0 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              @click.stop="handleLogin"
              class="flex w-full justify-center rounded-md bg-regal-black/70 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-regal-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >Sign in</button
            >
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { useUserStoreHook } from '@/hooks/modules/userHook'
  const { GET_USER_INFO } = useUserStoreHook()
  const { push } = useRouter()
  const loading = ref(false)
  const formData = reactive({
    userName: 'admin',
    pwd: '123456'
  })

  async function handleLogin() {
    loading.value = true
    try {
      await GET_USER_INFO(formData)
      await push({ name: 'Dashboard' })
    } catch (error) {
      console.warn(error)
    } finally {
      loading.value = false
    }
  }
</script>
