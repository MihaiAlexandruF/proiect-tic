import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)


app.config.globalProperties.$img = (path) =>{
  return `${import.meta.env.VITE_API_BASE_URL}${path}`;
}
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(ElementPlus)

const authStore = useAuthStore()
authStore.init().finally(() => {
  app.mount('#app')
})