<script setup>
import logo from '@/assets/sg-logo.png'

const countries = [
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', code: '+880' },
  { code: 'US', name: 'United States', flag: '🇺🇸', code: '+1' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', code: '+44' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', code: '+1' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', code: '+1' },
]

const phoneCodes = [
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+1', country: 'CA', flag: '🇨🇦' },
]
</script>

<template>
  <section
    class="w-full min-h-screen mx-auto"
    style="
      background-image:
        repeating-linear-gradient(0deg, transparent, transparent 98px, #eeedf9e6 100px),
        repeating-linear-gradient(90deg, transparent, transparent 98px, #eeedf9e6 100px);
      background-color: #f1f4f8;
    "
  >
    <div class="container rounded-2xl p-10 mx-auto">
      <div>
        <div class="mx-auto bg-[#7F41EF] rounded-t-xl overflow-hidden text-center relative">
          <!-- Box/Grid pattern overlay -->
          <div
            class="absolute inset-0 opacity-10"
            style="
              background-image: radial-gradient(circle, white 1px, transparent 1px);
              background-size: 20px 20px;
            "
          ></div>

          <div class="relative z-10">
            <img :src="logo" class="w-md mx-auto mt-5" alt="logo" />
            <h1 class="text-white text-2xl font-bold mb-4">Express Application</h1>
            <p class="text-white mb-4 text-base">
              Complete your application to get started with your academic journey
            </p>
          </div>
        </div>

        <form class="bg-white p-5">
          <div class="rounded-lg border p-4 border-gray-300">
            <h1 class="text-xl border-b border-gray-300 font-medium pb-2">Personal Information</h1>
          </div>

          <div class="mt-5">
            <label class="block text-sm mb-2">Full Name</label>
            <div>
              <input
                class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                placeholder="Enter you full name here"
              />
            </div>
          </div>

          <div class="flex justify-between gap-4">
            <div class="mt-5 w-full">
              <label class="block text-sm mb-2">Email Address</label>
              <div>
                <input
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  placeholder="your-mail@example.com"
                />
              </div>
            </div>

            <div class="mt-5 w-full">
              <label class="block text-sm mb-2">Country of Residence</label>
              <div>
                <input
                  class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                  list="country-list"
                  placeholder="Select the country"
                />

                <datalist id="country-list">
                  <option v-for="c in countries" :key="c.code" :value="c.name">
                    {{ c.name }}
                  </option>
                </datalist>
              </div>
            </div>
          </div>

          <div class="mt-5 w-full">
            <label class="block text-sm mb-2">Country of Residence</label>
            <div>
              <input
                class="border w-full rounded-md border-gray-300 p-2 focus:outline-none focus:border-purple-700"
                list="country-list"
                placeholder="Select the country"
              />

              <datalist id="country-list">
                <option v-for="c in countries" :key="c.code" :value="c.name">
                  {{ c.name }}
                </option>
              </datalist>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
