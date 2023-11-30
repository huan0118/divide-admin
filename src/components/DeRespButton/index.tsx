import { defineComponent } from 'vue'
import { isString } from 'lodash-es'

export default defineComponent({
  name: 'DeRespButton',
  emits: ['resp-action'],
  props: {
    exclude: {
      type: [Array, String],
      default: () => {
        return []
      }
    }
  },
  setup(props, { attrs, emit }) {
    const { currentRoute } = useRouter()
    const excludeList = isString(props.exclude) ? props.exclude.split(',') : props.exclude
    /**
     * _pressButtons 为页面当前注入的操作权限
     */
    const { _pressButtons } = currentRoute.value.meta
    const action = ref<PressButtonRow[]>()
    if (_pressButtons) {
      action.value = [..._pressButtons].filter(
        (item) => !excludeList.some((exclude) => item.code == exclude)
      )
    }

    function handleClick(code: string) {
      emit(`resp-action`, code)
    }

    return () => (
      <>
        <el-space wrap size={12} {...attrs}>
          {action.value &&
            action.value.map((row) => (
              <el-button
                onClick={() => {
                  handleClick(row.code)
                }}
              >
                {row.name}
              </el-button>
            ))}
        </el-space>
      </>
    )
  }
})
