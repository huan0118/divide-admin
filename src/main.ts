import '@/styles/index.scss'
import 'element-plus/theme-chalk/el-loading.css'
import 'element-plus/theme-chalk/el-message.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './permission'

const app = createApp(App)

app.use(router)
app.mount('#app')
