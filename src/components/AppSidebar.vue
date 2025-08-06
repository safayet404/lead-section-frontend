<script setup lang="ts">
import { Calendar, Home, Inbox, Search, Settings } from 'lucide-vue-next'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

// Define emits
const emit = defineEmits(['navigate'])

// Menu items with navigation keys
const items = [
  {
    title: 'Home',
    key: 'dashboard',
    icon: Home,
  },
  {
    title: 'Inbox',
    key: 'inbox',
    icon: Inbox,
  },
  {
    title: 'Calendar',
    key: 'calendar',
    icon: Calendar,
  },
  {
    title: 'Search',
    key: 'search',
    icon: Search,
  },
  {
    title: 'Settings',
    key: 'settings',
    icon: Settings,
  },
]

const handleNavigation = (key: string) => {
  emit('navigate', key)
}
</script>

<template>
  <Sidebar>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in items" :key="item.title">
              <SidebarMenuButton @click="handleNavigation(item.key)">
                <component :is="item.icon" />
                <span>{{ item.title }}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>
