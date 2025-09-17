import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import Vue3EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

import { createToaster } from '@meforma/vue-toaster'
import { createPinia } from 'pinia'

// ✅ Import Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import './assets/main.css'
import './assets/css/sidebar.css'

const vuetify = createVuetify({
  components,
  directives,
})

const app = createApp(App)
const pinia = createPinia()

app.use(router)
app.component('EasyDataTable', Vue3EasyDataTable)
app.use(pinia)
app.use(createToaster())

// ✅ Register Vuetify
app.use(vuetify)

app.mount('#app')
