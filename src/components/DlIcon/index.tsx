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
  name: 'DlIcon',
  setup(props, { attrs }) {
    return () => <IconifyIcon {...attrs} icon={props.icon} />
  }
})
