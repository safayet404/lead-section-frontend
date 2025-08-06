<script setup lang="ts">
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="bg-amber-400">
      <SidebarTrigger />
      <slot />
    </main>
  </SidebarProvider>
</template>
