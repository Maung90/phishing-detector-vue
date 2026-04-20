import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/axios' // Import custom axios instance

export const useScannerStore = defineStore('scanner', () => {
  const scanHistory = ref([])
  const feedbackReports = ref([])
  
  const isLoading = ref(false)
  const error = ref(null)
  
  const currentScanResult = ref(null)

  const getRecentScans = computed(() => {
    return (limit = 10) => scanHistory.value.slice(0, limit)
  })

  const fetchScanHistory = async (limit = 100) => {
    try {
      const response = await api.get(`/scans?limit=${limit}`)
      scanHistory.value = response.data.history || []
    } catch (err) {
      console.error('Gagal mengambil riwayat scan:', err)
    }
  }

const performScan = async (scanData) => {
    isLoading.value = true
    error.value = null
    currentScanResult.value = null

    try {
      const targetData = scanData.url || scanData.data

      const response = await api.post('/scan', {
        type: scanData.type,
        target: targetData
      })
      
      const scanRecord = response.data.result

      currentScanResult.value = scanRecord

      scanHistory.value.unshift(scanRecord)
      
      if (scanHistory.value.length > 100) {
        scanHistory.value = scanHistory.value.slice(0, 100)
      }

      return { success: true, data: scanRecord }
    } catch (err) {
      error.value = err.response?.data?.message || err.response?.data?.detail || 'Terjadi kesalahan saat menganalisis target.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const submitFeedback = async (scanId, feedback) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post('/feedback', {
        scanId: scanId,
        keterangan: feedback.keterangan,
        proposedStatus: feedback.proposedStatus
      })

      const feedbackRecord = {
        id: response.data.id || Date.now(),
        scanId,
        keterangan: feedback.keterangan,
        proposedStatus: feedback.proposedStatus,
        timestamp: new Date().toISOString(),
        status: 'pending' // Biasanya perlu direview admin
      }

      feedbackReports.value.unshift(feedbackRecord)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mengirim feedback.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    scanHistory,
    feedbackReports,
    isLoading,
    error,
    currentScanResult,
    
    getRecentScans,
    
    fetchScanHistory,
    performScan,
    submitFeedback
  }
})