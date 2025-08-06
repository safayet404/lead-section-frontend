<script setup>
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
// Import your content components
import { ref } from 'vue'
import Dashboard from './components/Dashboard.vue'
import InboxView from './components/InboxView.vue'
import CalenderView from './components/CalenderView.vue'

// State to track which content to show
const activeView = ref('dashboard')
</script>

<template>
  <SidebarProvider>
    <AppSidebar @navigate="activeView = $event" />
    <main class="flex-1 p-6">
      <SidebarTrigger />

      <!-- Your content goes here -->
      <div class="mt-4">
        <!-- Conditional rendering based on sidebar selection -->
        <Dashboard v-if="activeView === 'dashboard'" />
        <InboxView v-else-if="activeView === 'inbox'" />
        <CalenderView v-else-if="activeView === 'calendar'" />
        <!-- Add more views as needed -->

        <!-- Or use router-view if using Vue Router -->
        <!-- <RouterView /> -->
      </div>
    </main>
  </SidebarProvider>
</template>

<style scoped>
main {
  min-height: 100vh;
  background: var(--background);
}
</style>
