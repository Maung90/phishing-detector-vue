import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../../utils/axios'

export const useModelStore = defineStore('model', () => {
  // --- STATE ---
  const mlModels = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  // --- ACTIONS ---
  const fetchModels = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/admin/models/')
      mlModels.value = response.data.models || []
    } catch (err) {
      error.value = err.response?.data?.detail || 'Gagal mengambil data model'
    } finally {
      isLoading.value = false
    }
  }

  const uploadModel = async (file, performanceData) => {
    isLoading.value = true
    error.value = null
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      formData.append('performance_data', JSON.stringify(performanceData))

      const response = await api.post('/admin/models/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      await fetchModels()
      
      return { success: true, message: response.data.message }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Gagal mengunggah model. Pastikan file valid.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const deleteModel = async (modelId) => {
    try {
      await api.delete(`/admin/models/${modelId}`)
      
      mlModels.value = mlModels.value.filter(m => m.id !== modelId)
      return { success: true }
    } catch (err) {
      return { success: false, error: err.response?.data?.detail || 'Gagal menghapus model' }
    }
  }

  const toggleModelStatus = async (modelId) => {
    console.warn("Endpoint untuk mengubah status aktif model belum diimplementasikan di backend!")
    // Jika backend sudah siap, kamu bisa menembak endpoint PATCH/PUT di sini:
    // await api.patch(`/admin/models/${modelId}/status`)
    // await fetchModels()
  }

  return {
    mlModels,
    isLoading,
    error,
    fetchModels,
    uploadModel,
    deleteModel,
    toggleModelStatus
  }
})