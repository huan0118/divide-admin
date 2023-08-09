import '@/styles/index.scss'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './permission'

const app = createApp(App)

// 全局注册`@iconify/vue`图标库
import DlIcon from '@/components/DlIcon/index'
app.component('DlIcon', DlIcon)

app.use(router)
app.mount('#app')
