import { createRouter, createWebHistory } from 'vue-router'
import SideNavLayout from '@/Layout/SideNavLayout.vue'
import Dashboard from '@/components/Dashboard.vue'
import Roles from '@/components/Roles.vue'
import LoginForm from '@/components/Auth/LoginForm.vue'
import axios from 'axios'
import Profile from '@/components/Auth/Profile.vue'
import api from '@/lib/api'
import LeadList from '@/components/Lead/LeadList.vue'
import AllStatus from '@/components/Settings/AllStatus.vue'
import BranchList from '@/components/Settings/BranchList.vue'
import EventList from '@/components/Settings/EventList.vue'
import CountryList from '@/components/Settings/CountryList.vue'
import LeadAssign from '@/components/Lead/LeadAssign.vue'
import UserList from '@/components/User/UserList.vue'
import UploadLead from '@/components/Lead/UploadLead.vue'
import ExpressApplication from '@/components/Express/ExpressApplication.vue'
import ExpressApplicationList from '@/components/Express/ExpressApplicationList.vue'

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
        {
          path: 'lead-assign',
          name: 'Lead Assign',
          component: LeadAssign,
        },
        {
          path: 'upload-lead',
          name: 'Upload Lead',
          component: UploadLead,
        },
        {
          path: 'status',
          name: 'All Status',
          component: AllStatus,
        },
        {
          path: 'branch',
          name: 'Branch List',
          component: BranchList,
        },
        {
          path: 'events',
          name: 'Event List',
          component: EventList,
        },
        {
          path: 'country',
          name: 'Country List',
          component: CountryList,
        },
        {
          path: 'user',
          name: 'User List',
          component: UserList,
        },
        {
          path: 'express-application',
          name: 'Express',
          component: ExpressApplication,
        },
        {
          path: 'express-list',
          name: 'Express-List',
          component: ExpressApplicationList,
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
