import {
    createApp
}
from 'vue'
import App from './App.vue'
import router from './router'

import locale from 'element-plus/lib/locale/lang/zh-cn'

import ElementPlus from 'element-plus/dist/index.full.min.js'
import 'element-plus/dist/index.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './assets/main.css'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(ElementPlus,{
	locale
})

app.use(router)

app.mount('#app')