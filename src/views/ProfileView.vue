<template>
  <div class="bg-gray-50 min-h-screen py-10">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 h-32"></div>
        
        <div class="px-6 py-8 sm:p-10 relative">
          <!-- Avatar -->
          <div class="-mt-20 flex justify-center sm:justify-start mb-6">
            <img 
              v-if="authStore.profile?.photoURL" 
              :src="authStore.profile.photoURL" 
              class="h-24 w-24 rounded-full border-4 border-white shadow-md object-cover bg-white"
              alt="Profile"
            />
            <div v-else class="h-24 w-24 rounded-full border-4 border-white shadow-md bg-gray-200 flex items-center justify-center text-gray-400">
              <svg class="h-12 w-12" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
          </div>
          
          <h1 class="text-2xl font-bold text-gray-900 mb-8">Edit Profile</h1>
          
          <form @submit.prevent="saveProfile" class="space-y-6">
            <!-- Email (Read-only) -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Email Address (Google)</label>
              <div class="mt-1">
                <input 
                  type="email" 
                  :value="authStore.profile?.email" 
                  disabled
                  class="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed px-4 py-2 border"
                />
              </div>
              <p class="mt-1 text-sm text-gray-500">Your email is linked to your Google account and cannot be changed here.</p>
            </div>

            <!-- Display Name -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Display Name</label>
              <div class="mt-1">
                <input 
                  type="text" 
                  v-model="editForm.displayName"
                  required
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-4 py-2 border"
                />
              </div>
            </div>

            <!-- Phone Number -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Phone Number</label>
              <div class="mt-1">
                <input 
                  type="tel" 
                  v-model="editForm.phoneNumber"
                  placeholder="e.g. 0812345678"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md px-4 py-2 border"
                />
              </div>
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-gray-100">
              <span class="text-sm font-medium text-green-600" v-if="successMessage">{{ successMessage }}</span>
              <span class="text-sm font-medium text-red-600" v-else-if="errorMessage">{{ errorMessage }}</span>
              <span v-else></span>
              
              <button 
                type="submit" 
                :disabled="isSaving"
                class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ isSaving ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const isSaving = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const editForm = ref({
  displayName: '',
  phoneNumber: ''
})

const loadData = () => {
  if (authStore.profile) {
    editForm.value.displayName = authStore.profile.displayName || ''
    editForm.value.phoneNumber = authStore.profile.phoneNumber || ''
  }
}

watch(() => authStore.profile, loadData, { immediate: true })

onMounted(() => {
  if (!authStore.user && !authStore.loading) {
    router.push('/') 
  }
})

const saveProfile = async () => {
  isSaving.value = true
  successMessage.value = ''
  errorMessage.value = ''
  
  try {
    await authStore.updateProfileData({
      displayName: editForm.value.displayName,
      phoneNumber: editForm.value.phoneNumber
    })
    successMessage.value = 'Profile updated successfully!'
    setTimeout(() => successMessage.value = '', 3000)
  } catch (error) {
    errorMessage.value = 'Failed to update profile.'
  } finally {
    isSaving.value = false
  }
}
</script>
