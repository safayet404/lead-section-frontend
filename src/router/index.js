import { createRouter, createWebHistory } from 'vue-router'
import SideNavLayout from '@/Layout/SideNavLayout.vue'
import Dashboard from '@/components/Dashboard.vue'
import Roles from '@/components/Roles.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: SideNavLayout,
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: Dashboard,
        },
        {
          path: 'roles',
          name: 'Roles',
          component: Roles,
        },
      ],
    },
    {
      path: '/login',
      component: LoginForm,
    },
  ],
})

export default router
