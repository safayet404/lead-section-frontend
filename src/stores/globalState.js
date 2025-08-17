// src/stores/globalUser.js
import { reactive, watch } from 'vue'

// Initialize state from sessionStorage, or set to null if not found
const savedUserId = sessionStorage.getItem('userId')

export const globalState = reactive({
  userId: savedUserId || null,
})

// Watch for changes in userId and save to sessionStorage
watch(
  () => globalState.userId,
  (newUserId) => {
    if (newUserId) {
      sessionStorage.setItem('userId', newUserId)
    } else {
      sessionStorage.removeItem('userId') // Remove on logout
    }
  },
)
