import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  const mlModels = ref([
    {
      id: 1,
      name: 'Random Forest Classifier v2.3',
      type: 'Random Forest',
      accuracy: 94.7,
      createdAt: '2024-01-10T12:00:00Z',
      status: 'active',
      version: '2.3.0',
      trainedSamples: 125000
    },
    {
      id: 2,
      name: 'Neural Network URL Analyzer',
      type: 'Deep Learning',
      accuracy: 96.2,
      createdAt: '2024-02-15T14:30:00Z',
      status: 'active',
      version: '1.5.2',
      trainedSamples: 200000
    },
    {
      id: 3,
      name: 'Legacy SVM Model',
      type: 'Support Vector Machine',
      accuracy: 89.3,
      createdAt: '2023-11-05T09:15:00Z',
      status: 'inactive',
      version: '1.0.0',
      trainedSamples: 50000
    }
  ])

  const systemStats = ref({
    totalScans: 1847562,
    totalUsers: 45231,
    activeModels: 2,
    systemHealth: 98.5,
    threatDetectionRate: 94.7,
    falsePositiveRate: 2.3
  })

  const createModel = async (modelData) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newModel = {
      id: mlModels.value.length + 1,
      name: modelData.name,
      type: modelData.type,
      accuracy: modelData.accuracy || 0,
      createdAt: new Date().toISOString(),
      status: 'inactive',
      version: '1.0.0',
      trainedSamples: modelData.trainedSamples || 0
    }
    
    mlModels.value.unshift(newModel)
    return { success: true, model: newModel }
  }

  const deleteModel = async (modelId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = mlModels.value.findIndex(m => m.id === modelId)
    if (index !== -1) {
      mlModels.value.splice(index, 1)
      systemStats.value.activeModels = mlModels.value.filter(m => m.status === 'active').length
      return { success: true }
    }
    
    return { success: false, error: 'Model not found' }
  }

  const toggleModelStatus = (modelId) => {
    const model = mlModels.value.find(m => m.id === modelId)
    if (model) {
      model.status = model.status === 'active' ? 'inactive' : 'active'
      systemStats.value.activeModels = mlModels.value.filter(m => m.status === 'active').length
    }
  }

  const activeModels = computed(() => 
    mlModels.value.filter(m => m.status === 'active')
  )

  return {
    mlModels,
    systemStats,
    activeModels,
    createModel,
    deleteModel,
    toggleModelStatus
  }
})