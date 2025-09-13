// src/stores/globalUser.js
import { reactive, watch } from 'vue'

// Load saved values from sessionStorage
const savedUserId = sessionStorage.getItem('userId')
const savedUserRole = sessionStorage.getItem('userRole')

// Global reactive state
export const globalState = reactive({
  userId: savedUserId || null,
  userRole: savedUserRole || null,
})

watch(
  () => ({ userId: globalState.userId, userRole: globalState.userRole }),
  ({ userId, userRole }) => {
    if (userId) {
      sessionStorage.setItem('userId', userId)
    } else {
      sessionStorage.removeItem('userId')
    }

    if (userRole) {
      sessionStorage.setItem('userRole', userRole)
    } else {
      sessionStorage.removeItem('userRole')
    }
  },
  { deep: true },
)
