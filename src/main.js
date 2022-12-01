import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus/dist/index.full.min.js'
import 'element-plus/dist/index.css'

import './assets/main.css'

const app = createApp(App)

app.use(ElementPlus)

app.use(router)

app.mount('#app')
