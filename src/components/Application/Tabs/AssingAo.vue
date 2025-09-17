<template>
  <Listbox as="div" v-model="selectedUser">
    <div class="relative mt-1">
      <ListboxButton
        class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 sm:text-sm"
      >
        <span class="block truncate">{{
          selectedUser
            ? selectedUser.name + ' - ' + selectedUser.email
            : 'Search and select an officer'
        }}</span>
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg
            class="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            v-for="user in users"
            :key="user.id"
            :value="user"
            as="template"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'bg-purple-600 text-white' : 'text-gray-900',
                'relative cursor-default select-none py-2 pl-3 pr-9',
              ]"
            >
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']"
                >{{ user.name }} - {{ user.email }}</span
              >
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import api from '@/lib/api'

const users = ref([])
const selectedUser = ref(null)

onMounted(async () => {
  try {
    const response = await api.get('/user-list')
    users.value = response?.data?.list || []
  } catch (error) {
    console.error('Error fetching users:', error)
  }
})
</script>
