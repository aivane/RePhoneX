import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)

  function setUser(newUser) {
    user.value = newUser
  }

  function setLoading(status) {
    loading.value = status
  }

  return { user, loading, setUser, setLoading }
})
