import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'
import createRouter from './router'
import 'element-plus/dist/index.css'
import layouts from './components/layouts' // 全局布局组件

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(createRouter())
app.use(layouts)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.mount('#app')
