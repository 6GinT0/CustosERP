import { createApp } from 'vue'
import './App.css'
import App from './App.vue'
import 'leaflet/dist/leaflet.css'
/** Vuetify */
import { vuetify } from '@renderer/config/vuetify'
/** Router */
import router from '@renderer/router'

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
