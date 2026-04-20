import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../utils/axios'

export const useFeedbackStore = defineStore('feedback', () => {
  // --- STATE ---
  const feedbacks = ref([]) 
  const isLoading = ref(false)
  const error = ref(null)

  // --- ACTIONS ---

  // Fungsi khusus untuk mengambil data Feedback admin
  const fetchAdminFeedback = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get('/admin/feedbacks')
      
      feedbacks.value = response.data.data || response.data
      
      return { success: true, data: feedbacks.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.detail || 'Gagal mengambil data Feedback'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }


  return {
    // States
    feedbacks,
    isLoading,
    error,
    
    // Actions
    fetchAdminFeedback
  }
})