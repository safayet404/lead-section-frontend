<template>
  <div class="flex">
    <!-- Sidebar -->
    <aside
      :class="[
        'h-screen bg-gray-800 text-white transition-all duration-300',
        isOpen ? 'w-64' : 'w-16',
      ]"
    >
      <div class="flex items-center justify-between p-4 border-b border-gray-700">
        <h1 v-if="isOpen" class="text-lg font-bold">SGE</h1>
        <button @click="toggleSidebar" class="text-gray-300 hover:text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path :d="isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
          </svg>
        </button>
      </div>

      <nav class="mt-4">
        <ul>
          <li v-for="item in menuItems" :key="item.label">
            <div>
              <!-- If no children, make it a router-link -->
              <router-link
                v-if="!item.children"
                :to="item.to"
                class="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
              >
                <component :is="item.icon" class="w-5 h-5" />
                <span v-if="isOpen" class="flex-1">{{ item.label }}</span>
              </router-link>

              <!-- If children exist, make parent clickable to toggle -->
              <button
                v-else
                class="flex items-center gap-3 px-4 py-2 hover:bg-gray-700"
                @click="toggleGroup(item.label)"
              >
                <component :is="item.icon" class="w-5 h-5" />
                <span v-if="isOpen" class="flex-1">{{ item.label }}</span>
                <svg
                  v-if="isOpen"
                  class="w-4 h-4 transform transition-transform duration-300"
                  :class="{ 'rotate-90': openGroups[item.label] }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <!-- Submenu -->
              <transition name="fade">
                <ul v-if="item.children && openGroups[item.label] && isOpen" class="ml-8 space-y-1">
                  <li v-for="sub in item.children" :key="sub.label">
                    <router-link
                      :to="sub.to"
                      class="block px-4 py-1 text-sm text-gray-300 hover:text-white hover:underline"
                    >
                      {{ sub.label }}
                    </router-link>
                  </li>
                </ul>
              </transition>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Home, Settings, Users } from 'lucide-vue-next'

const isOpen = ref(true)
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const openGroups = reactive({})
const toggleGroup = (label) => {
  openGroups[label] = !openGroups[label]
}

// Menu config with routes
const menuItems = [
  {
    label: 'Dashboard',
    icon: Home,
    to: '/', // route path
  },
  {
    label: 'Leads',
    icon: Users,
    to: '/leads', // route path
  },
  {
    label: 'Management',
    icon: Settings,
    children: [
      { label: 'Users', to: '/users' },
      { label: 'Roles', to: '/roles' },
      { label: 'Permissions', to: '/permissions' },
    ],
  },
]
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
}
</style>
