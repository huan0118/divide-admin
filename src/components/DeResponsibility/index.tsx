import { defineComponent } from 'vue'
import { userPermissionHook } from '@/hooks/modules/userPermissionHook'

export default defineComponent({
  props: ['modelValue'],
  emits: ['update:modelValue'],
  name: 'DeResponsibility',
  setup(props, { attrs, emit }) {
    const { menuMap } = userPermissionHook()
    const { currentRoute, replace } = useRouter()
    const { menuId } = currentRoute.value.meta
    const { permissions } = menuMap.get(menuId as number)!
    /**
     * 取默认岗位职能
     */
    const defaultItem =
      permissions!.find((row) => row.jobId === props.modelValue) || permissions![0]
    const defaultValue = ref(defaultItem ? defaultItem.jobId : '')
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
    const handleChange = () => {
      const { query, fullPath } = currentRoute.value
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
