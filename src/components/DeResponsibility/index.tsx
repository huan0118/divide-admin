import { defineComponent } from 'vue'
import { userPermissionHook } from '@/hooks/modules/userPermissionHook'

export default defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  name: 'DeResponsibility',
  setup(props, { attrs, emit }) {
    const { menuMap, cacheCurrentRouteJobMap } = userPermissionHook()
    const { currentRoute, replace } = useRouter()
    const { menuId } = currentRoute.value.meta
    const { permissions } = menuMap.get(menuId as number)!
    /**
     * 默认岗位职能
     */
    const defaultValue = ref()

    if (menuId && permissions?.length) {
      for (const row of permissions) {
        if (row.jobId === props.modelValue) {
          cacheCurrentRouteJobMap.set(+menuId, props.modelValue)
          break
        }
      }
      if (cacheCurrentRouteJobMap.get(+menuId)) {
        defaultValue.value = cacheCurrentRouteJobMap.get(+menuId)
      } else {
        defaultValue.value = permissions[0].jobId
        cacheCurrentRouteJobMap.set(+menuId, defaultValue.value)
      }
    } else {
      console.warn('当前菜单没有岗位职能')
    }
    /**
     * 监听modelValue
     */
    watchEffect(() => {
      emit('update:modelValue', defaultValue.value)
    })
    /**
     * 进行路由替换更新
     * @param value
     */
    const handleChange = (val: string) => {
      const { query, fullPath, meta } = currentRoute.value
      cacheCurrentRouteJobMap.set(+meta.menuId!, val)
      replace({ path: '/redirect' + fullPath, query })
    }
    return () => (
      <div>
        <el-select {...attrs} vModel={defaultValue.value} onChange={handleChange}>
          {permissions!.map((row) => (
            <el-option key={row.jobId} label={row.jobName} value={row.jobId}></el-option>
          ))}
        </el-select>
      </div>
    )
  }
})
