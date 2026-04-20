import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/axios'

export const useApiStore = defineStore('api', () => {
  
  const apiKeys = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const totalRequests = computed(() => {
    return apiKeys.value.reduce((sum, key) => sum + (key.requestCount || 0), 0)
  })

  const fetchApiKeys = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/keys')
      apiKeys.value = response.data.keys || []
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.detail || 'Gagal mengambil daftar API Key'
      console.error('Error fetching API keys:', err)
    } finally {
      isLoading.value = false
    }
  }

  const createApiKey = async (name) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.post('/keys', { name: name })
      
      const newKey = response.data.key
      const fullSecretKey = response.data.fullKey
      
      apiKeys.value.unshift(newKey)
      
      return { 
        success: true, 
        key: newKey,
        fullKey: fullSecretKey
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.detail || 'Gagal membuat API key'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 3. Menghapus API Key
  const deleteApiKey = async (keyId) => {
    try {
      await api.delete(`/keys/${keyId}`)
      
      const index = apiKeys.value.findIndex(k => k.id === keyId)
      if (index !== -1) {
        apiKeys.value.splice(index, 1)
        return { success: true }
      }
      return { success: false, error: 'Key tidak ditemukan di tampilan' }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || err.response?.data?.detail || 'Gagal menghapus API key' 
      }
    }
  }

  // 4. Mengambil statistik API Key
  const getKeyStats = async () => {
    try {
      // Opsi A: Jika backend kamu menyediakan endpoint khusus untuk statistik
      const response = await api.get('/keys/stats')
      return response.data
    } catch (err) {
      return {
        totalKeys: apiKeys.value.length,
        totalRequests: totalRequests.value,
        activeKeys: apiKeys.value.filter(k => k.lastUsed).length
      }
    }
  }

  return {
    apiKeys,
    isLoading,
    error,
    
    totalRequests,
    
    fetchApiKeys,
    createApiKey,
    deleteApiKey,
    getKeyStats
  }
})