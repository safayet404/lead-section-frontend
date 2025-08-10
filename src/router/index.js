import { createRouter, createWebHistory } from 'vue-router'
import SideNavLayout from '@/Layout/SideNavLayout.vue'
import Dashboard from '@/components/Dashboard.vue'
import Roles from '@/components/Roles.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'
import axios from 'axios'

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
      beforeEnter: async (to, from, next) => {
        try {
          await axios.get('/profile', { withCredentials: true })

          next({ path: '/' })
        } catch (error) {
          if (error.response && error.response.status === 401) {
            next()
          } else {
            next()
          }
        }
      },
    },
  ],
})

export default router
