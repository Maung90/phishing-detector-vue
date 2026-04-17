import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useApiStore = defineStore('api', () => {
  const apiKeys = ref([
    {
      id: 1,
      name: 'Production API',
      prefix: 'sqr_prod',
      fullKey: 'sqr_prod_ak7Gm2nP9xL4vB8qR5sT1wE6yU3oI0',
      createdAt: '2024-01-15T10:30:00Z',
      lastUsed: '2024-03-01T14:22:00Z',
      requestCount: 15847
    },
    {
      id: 2,
      name: 'Development Key',
      prefix: 'sqr_dev',
      fullKey: 'sqr_dev_bK4hN8mC2vL6pQ9rS5tW1eY7uI3oA0',
      createdAt: '2024-02-10T08:15:00Z',
      lastUsed: '2024-03-02T09:45:00Z',
      requestCount: 3204
    }
  ])

  const totalRequests = computed(() => {
    return apiKeys.value.reduce((sum, key) => sum + key.requestCount, 0)
  })

  const generateRandomKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let key = ''
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return key
  }

  const createApiKey = async (name) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (apiKeys.value.find(k => k.name === name)) {
      return { success: false, error: 'API key with this name already exists' }
    }

    const randomKey = generateRandomKey()
    const prefix = name.toLowerCase().replace(/\s+/g, '_').substring(0, 10)
    const fullKey = `sqr_${prefix}_${randomKey}`
    
    const newKey = {
      id: apiKeys.value.length + 1,
      name,
      prefix: `sqr_${prefix}`,
      fullKey,
      createdAt: new Date().toISOString(),
      lastUsed: null,
      requestCount: 0
    }
    
    apiKeys.value.unshift(newKey)
    
    return { 
      success: true, 
      key: newKey,
      fullKey: fullKey // Only returned once during creation
    }
  }

  const deleteApiKey = async (keyId) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const index = apiKeys.value.findIndex(k => k.id === keyId)
    if (index !== -1) {
      apiKeys.value.splice(index, 1)
      return { success: true }
    }
    
    return { success: false, error: 'API key not found' }
  }

  const getKeyStats = () => {
    return {
      totalKeys: apiKeys.value.length,
      totalRequests: totalRequests.value,
      activeKeys: apiKeys.value.filter(k => k.lastUsed).length
    }
  }

  return {
    apiKeys,
    totalRequests,
    createApiKey,
    deleteApiKey,
    getKeyStats
  }
})