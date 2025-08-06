import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AppSidebar from '@/components/AppSidebar.vue'
import SideNavLayout from '@/Layout/SideNavLayout.vue'
import Dashboard from '@/components/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SideNavLayout,
      children: [
        { path: '', name: 'Dashboard', component: Dashboard },
        // other routes go here
      ],
    },
  ],
})

export default router
