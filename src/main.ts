import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './permission'

import '@/styles/tailwind.scss'
import '@/styles/index.scss'

const app = createApp(App)

/**
 * 注册全局组件
 */
import DeIcon from '@/components/DeIcon/index'
import DeResponsibility from '@/components/DeResponsibility/index'

app.component('DeResponsibility', DeResponsibility)
app.component('DeIcon', DeIcon)

app.use(router)
app.mount('#app')
