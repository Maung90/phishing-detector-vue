import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
// 1. Import instance axios yang sudah kamu buat di folder utils
import api from '../utils/axios' 

export const useAdminStore = defineStore('admin', () => {
  const mlModels = ref([])
  const systemStats = ref(null)
  const isLoading = ref(false)
  const error = ref(null)

  const activeModels = computed(() => 
    mlModels.value.filter(m => m.status === 'active')
  )

  const fetchModels = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/models')
      mlModels.value = response.data.models 
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengambil data model'
      console.error('Error fetching models:', err)
    } finally {
      isLoading.value = false
    }
  }

  const fetchSystemStats = async () => {
    try {
      const response = await api.get('/system-stats')
      systemStats.value = response.data.stats
    } catch (err) {
      console.error('Error fetching system stats:', err)
    }
  }

  const createModel = async (modelData) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.post('/models', {
        name: modelData.name,
        type: modelData.type,
        accuracy: modelData.accuracy || 0,
        trainedSamples: modelData.trainedSamples || 0
      })
      
      mlModels.value.unshift(response.data.model)
      return { success: true, model: response.data.model }
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal membuat model baru'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteModel = async (modelId) => {
    try {
      await api.delete(`/models/${modelId}`)
      
      const index = mlModels.value.findIndex(m => m.id === modelId)
      if (index !== -1) {
        mlModels.value.splice(index, 1)
        await fetchSystemStats() 
      }
      return { success: true }
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.message || 'Gagal menghapus model' 
      }
    }
  }

  const toggleModelStatus = async (modelId) => {
    const model = mlModels.value.find(m => m.id === modelId)
    if (!model) return
    
    const newStatus = model.status === 'active' ? 'inactive' : 'active'
    
    try {
      await api.patch(`/models/${modelId}/status`, { status: newStatus })
      model.status = newStatus
      await fetchSystemStats() 
    } catch (err) {
      console.error('Gagal mengupdate status:', err)
    }
  }

  return {
    mlModels,
    systemStats,
    isLoading,
    error,
    activeModels,
    fetchModels,
    fetchSystemStats,
    createModel,
    deleteModel,
    toggleModelStatus
  }
})