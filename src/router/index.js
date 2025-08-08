import { createRouter, createWebHistory } from 'vue-router'
import SideNavLayout from '@/Layout/SideNavLayout.vue'
import Dashboard from '@/components/Dashboard.vue'
import Leads from '@/components/Leads.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // root path
      component: SideNavLayout, // layout wrapper
      children: [
        {
          path: '', // child path = '/'
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: 'leads', // child path = '/'
          name: 'Leads',
          component: Leads,
        },
      ],
    },
  ],
})

export default router
