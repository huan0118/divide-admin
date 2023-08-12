import { defineComponent } from 'vue'
import { Icon as IconifyIcon } from '@iconify/vue'

export default defineComponent({
  components: { IconifyIcon },
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  name: 'DeIcon',
  setup(props, { attrs }) {
    return () => <IconifyIcon {...attrs} icon={props.icon} />
  }
})
