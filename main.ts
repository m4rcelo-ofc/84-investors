import { createApp } from 'vue'
import VueApexCharts from 'vue3-apexcharts'
import App from './app.vue'
import router from './router'
import './assets/css/main.css'

const app = createApp(App)

app.use(router)
app.component('apexchart', VueApexCharts)

app.mount('#app')
