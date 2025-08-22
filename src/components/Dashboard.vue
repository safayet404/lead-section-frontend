<script setup>
import { globalState } from '@/stores/globalState'
import AdminLeadSummary from './Summary/AdminLeadSummary.vue'
import Summary from './Summary/Summary.vue'

const userRole = Number(globalState.userRole)
console.log(userRole)
</script>

<template>
  <h1 class="text-black text-2xl font-bold">This is Dashboard</h1>

  <div v-if="userRole === 1">
    <AdminLeadSummary />
  </div>

  <div v-if="userRole === 3">
    <Summary />
  </div>
</template>

<style scoped></style>
