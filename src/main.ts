import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './permission'
import register from './plugin/register'

import '@/styles/tailwind.scss'
import '@/styles/index.scss'

const app = createApp(App)

register(app)

app.use(router)
app.mount('#app')
