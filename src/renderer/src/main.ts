import { createApp } from 'vue'
import './App.css'
import App from './App.vue'
import 'leaflet/dist/leaflet.css'
/** Vuetify */
import { vuetify } from '@renderer/config/vuetify'
/** Router */
import router from '@renderer/router'
/** ApexCharts */
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.use(VueApexCharts)

app.mount('#app')
