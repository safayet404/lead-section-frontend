<script setup>
import api from '@/lib/api'
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
const props = defineProps({
  id: {
    type: Number,
  },
})

const search = ref('')
const isOpen = ref(false)
const dropdownRef = ref(null)
const users = ref([])
const selectedOfficer = ref(null)
const assignOfficerList = ref([])

const filteredOptions = computed(() => {
  if (!search.value) return users.value
  return users.value.filter(
    (o) =>
      o.name.toLowerCase().includes(search.value.toLowerCase()) ||
      o.email.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const selectOption = (option) => {
  search.value = option.name
  selectedOfficer.value = option.id
  isOpen.value = false
}

const onClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

const fetchUsers = async () => {
  try {
    users.value = (await api.get('/user-list')).data.list || []
  } catch (error) {
    console.log(error)
  }
}

const assignList = async () => {
  try {
    assignOfficerList.value = (await api.get(`/single-assign/${props.id}`)).data || []
    console.log(assignOfficerList.value)
  } catch (error) {
    console.log(error)
  }
}

watch(props.id, (val) => {
  const assignOfficer = async () => {
    try {
      const payload = {
        application_id: props.id,
        user_id: selectedOfficer.value,
      }

      console.log(payload)

      const response = await api.post('/assign-ao', payload)
      if (response.data.status === 'success') {
        selectedOfficer.value = null
        search.value = ''
        alert('assing successfull')
      }
    } catch (error) {
      console.log(error)
    }
  }
})

onMounted(() => {
  document.addEventListener('click', onClickOutside)
  fetchUsers()
  assignList()
})

onBeforeUnmount(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-lg text-gray-700 font-medium">Application Officer Assignments</h1>

    <div class="mt-5">
      <label class="text-sm">Select Application Officer</label>

      <div class="flex gap-4">
        <div ref="dropdownRef" class="w-1/2 relative">
          <input
            type="text"
            v-model="search"
            @focus="isOpen = true"
            placeholder="Search users..."
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-[#7367F0]"
          />

          <ul
            v-if="isOpen && filteredOptions.length > 0"
            class="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto shadow-lg"
          >
            <li
              v-for="(option, index) in filteredOptions"
              :key="index"
              @click="selectOption(option)"
              class="px-3 py-2 hover:bg-purple-100 cursor-pointer"
            >
              {{ option.name }} - {{ option.email }}
            </li>
          </ul>
        </div>
        <div>
          <button
            @click="assignOfficer"
            class="px-4 py-2 bg-[#7367F0] rounded text-white disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!selectedOfficer"
          >
            Assign Officer
          </button>
        </div>
      </div>
    </div>

    <div>
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left text-sm font-medium text-gray-400 p-4 uppercase">Name</th>
            <th class="text-left text-sm font-medium text-gray-400 p-4 uppercase">Email</th>
            <th class="text-left text-sm font-medium text-gray-400 p-4 uppercase">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="a in assignOfficerList" :key="a.user.email" class="border-b border-gray-200">
            <td class="p-4 text-sm text-gray-700">{{ a.user.name }}</td>
            <td class="p-4 text-sm text-gray-700">{{ a.user.email }}</td>
            <td
              :class="{
                'text-green-600  ': a.status === 'Approved',
                'text-red-600': a.status === 'Rejected',
                'text-yellow-600  ': a.status === 'Pending',
                'text-gray-700':
                  a.status !== 'Approved' && a.status !== 'Rejected' && a.status !== 'Pending',
              }"
              class="p-4 text-sm"
            >
              {{ a.status }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
