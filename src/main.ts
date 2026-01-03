import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import './style.css'
import App from './App.vue'
// 导入DataV组件库（Vue 3版本）
import DataV from '@kjgl77/datav-vue3'

const router = createRouter({
    history: createWebHistory(),
    routes,
})

createApp(App).use(router).use(DataV).mount('#app')
