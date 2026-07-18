import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import createRouter from './router'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import '@/utils/plus' // 提前加载 Plus
import layouts from './components/layouts' // 全局布局组件

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(createRouter())
app.use(layouts)

app.mount('#app')
