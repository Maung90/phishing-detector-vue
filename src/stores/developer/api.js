import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/utils/axios' // Pastikan instance axios kamu benar

export const useApiStore = defineStore('api', () => {
  const apiKeys = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // Dummy state untuk total requests (karena belum ada di backend)
  const totalRequests = ref(15847) 

  // 1. Mengambil daftar API Key
  const fetchApiKeys = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/api-keys/')
      // Backend mengembalikan array [ {id, name, key_prefix...}, ... ]
      apiKeys.value = response.data 
    } catch (err) {
      error.value = err.response?.data?.detail || 'Gagal mengambil daftar API Key'
      console.error('Error fetching API keys:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 2. Membuat API Key Baru
  const createApiKey = async (name) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.post('/api-keys/', { name: name })
      
      // Ambil kunci mentah (SEC-...) dari response backend
      const rawSecretKey = response.data.api_key 
      
      // Refresh daftar kunci agar yang baru langsung muncul di tabel
      await fetchApiKeys()
      
      return { 
        success: true, 
        rawKey: rawSecretKey // Kembalikan raw key ke View agar bisa ditampilkan ke user
      }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Gagal membuat API key'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 3. Menghitung Statistik (Untuk Dashboard)
  const getKeyStats = () => {
    return {
      totalKeys: apiKeys.value.length,
      totalRequests: totalRequests.value,
      // Asumsi jika punya field 'is_active', atau hitung semua jika default aktif
      activeKeys: apiKeys.value.length 
    }
  }

  return {
    apiKeys,
    isLoading,
    error,
    totalRequests,
    fetchApiKeys,
    createApiKey,
    getKeyStats
  }
})