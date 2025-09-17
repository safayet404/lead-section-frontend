import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

import { createToaster } from '@meforma/vue-toaster'
import { createPinia } from 'pinia'

import './assets/main.css'
import './assets/css/sidebar.css'

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.component('EasyDataTable', Vue3EasyDataTable)
app.use(pinia)
app.use(createToaster())

app.mount('#app')
