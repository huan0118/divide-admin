import { useStorage } from '@vueuse/core'
import { createGlobalState } from '@vueuse/shared'
import { getMenu } from '@/api/menu'
export const userPermissionHook = createGlobalState(() => {
  // menu state
  const initialMenuInfo: MenuTreeInfo = []
  const menuInfo = useStorage('menu-store', initialMenuInfo)

  async function GET_MENU(token: string) {
    const { data } = await getMenu(token)
    menuInfo.value = data
  }

  function DEL_MENU() {
    menuInfo.value = []
  }
  return { menuInfo, GET_MENU, DEL_MENU }
})
