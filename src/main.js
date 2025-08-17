import './assets/main.css'
import './assets/css/sidebar.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'
import { createToaster } from '@meforma/vue-toaster'
const app = createApp(App)

app.use(router)
app.component('EasyDataTable', Vue3EasyDataTable)

app.use(createToaster())
app.mount('#app')
