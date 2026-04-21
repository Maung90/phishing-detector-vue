import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../../utils/axios'

export const useUsersStore = defineStore('users', () => {
  // --- STATE ---
  const users = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // --- ACTIONS ---
  const fetchAllUsers = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/admin/users/')
      users.value = response.data || []
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Gagal mengambil data pengguna.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    users,
    isLoading,
    error,
    fetchAllUsers
  }
})