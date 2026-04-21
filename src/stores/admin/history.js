import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../../utils/axios'

export const useHistoryStore = defineStore('history', () => {
  // --- STATE ---
  const histories = ref([]) 
  const isLoading = ref(false)
  const error = ref(null)

  // --- ACTIONS ---

  // Fungsi khusus untuk mengambil data history admin
  const fetchAdminHistory = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await api.get('/admin/history')
      
      histories.value = response.data.data || response.data
      
      return { success: true, data: histories.value }
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.detail || 'Gagal mengambil data history'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }


  // Fungsi untuk mengambil detail riwayat berdasarkan ID
  const fetchHistoryById = async (id) => {
    const isDetailLoading = ref(true) 
    
    try {
      const response = await api.get(`/admin/history/${id}`)
      return { success: true, data: response.data }
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Gagal mengambil detail riwayat'
      return { success: false, error: errorMsg }
    } finally {
      isDetailLoading.value = false
    }
  }


  return {
    // States
    histories,
    isLoading,
    error,
    
    // Actions
    fetchAdminHistory,
    fetchHistoryById
  }
})