import { createApp } from 'vue'
import './App.css'
import App from './App.vue'
// Vuetify
import { vuetify } from './config/vuetify'
// Router
import router from './router'

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
