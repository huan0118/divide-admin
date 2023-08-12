import '@/styles/index.scss'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './permission'

const app = createApp(App)

// 全局注册`@iconify/vue`图标库
import DeIcon from '@/components/DeIcon/index'
app.component('DeIcon', DeIcon)

// 全局注册`@iconify/vue`图标库
import DeResponsibility from '@/components/DeResponsibility/index'
app.component('DeResponsibility', DeResponsibility)

app.use(router)
app.mount('#app')
