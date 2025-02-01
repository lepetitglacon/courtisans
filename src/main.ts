import './assets/main.css'
import './utils/Array.ts'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { router } from "@/router.ts";

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
