import { createRouter, createWebHistory } from 'vue-router'
import SideNavLayout from '@/Layout/SideNavLayout.vue'
import Dashboard from '@/components/Dashboard.vue'
import Roles from '@/components/Roles.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'
import axios from 'axios'
import Profile from '@/components/Auth/Profile.vue'
import api from '@/lib/api'
import LeadList from '@/components/Lead/LeadList.vue'

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
        {
          path: 'profile',
          name: 'Profile',
          component: Profile,
        },
        {
          path: 'lead',
          name: 'Lead',
          component: LeadList,
        },
      ],
    },
    {
      path: '/login',
      component: LoginForm,
      beforeEnter: async (to, from, next) => {
        try {
          const res = await api.get('/profile')

          if (res.status === 200) {
            return next({ path: '/' })
          }
        } catch (error) {
          if (error.response?.status === 401) {
            return next()
          }
        }
        next()
      },
    },
  ],
})
router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    return next()
  }

  try {
    const res = await api.get('/profile')

    if (res.status === 200) {
      return next()
    }
  } catch (error) {
    if (error.response?.status === 401) {
      return next('/login')
    }
  }

  next('/login')
})
export default router
