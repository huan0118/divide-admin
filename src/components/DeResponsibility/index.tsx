import { defineComponent } from 'vue'
import { userPermissionHook } from '@/hooks/modules/userPermissionHook'

export default defineComponent({
  name: 'DeResponsibility',
  setup(props, { attrs }) {
    const { menuMap, cacheCurrentRouteJobMap } = userPermissionHook()
    const { currentRoute, replace } = useRouter()
    /**
     * permissions 为当前页面所有岗位职能数组
     * _permissions 为当前选中的职能
     */
    const { menuId, _permissions } = currentRoute.value.meta
    const { permissions } = menuMap.get(menuId as number)!
    /**
     * 默认岗位职能
     */
    const defaultValue = ref()
    if (_permissions) {
      defaultValue.value = _permissions.jobId
    }
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
