import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/axios'

export const useScannerStore = defineStore('scanner', () => {
  const scanHistory = ref([])
  const feedbackReports = ref([])
  
  const isLoading = ref(false)
  const error = ref(null)
  
  const currentScanResult = ref(null)

  const getRecentScans = computed(() => {
    return (limit = 10) => scanHistory.value.slice(0, limit)
  })

  // 1. Fetch History
  const fetchScanHistory = async (limit = 100) => {
    try {
      const response = await api.get(`/history?limit=${limit}`) 
      scanHistory.value = response.data || []
    } catch (err) {
      console.error('Gagal mengambil riwayat scan:', err)
    }
  }

  // 2. Perform Scan
  const performScan = async (scanData) => {
    isLoading.value = true
    error.value = null
    currentScanResult.value = null

    try {
      const targetUrl = scanData.url || scanData.data

      const response = await api.post('/detect', {
        url: targetUrl
      })
      
      const resultData = response.data

      const scanRecord = {
        id: resultData.id,
        url: resultData.url,
        status: resultData.status,
        score: resultData.probability,
        top_reasons: resultData.top_reasons,
        type: scanData.type,
        timestamp: new Date().toISOString()
      }

      currentScanResult.value = scanRecord

      scanHistory.value.unshift(scanRecord)
      
      if (scanHistory.value.length > 100) {
        scanHistory.value = scanHistory.value.slice(0, 100)
      }

      return { success: true, data: scanRecord }
    } catch (err) {
      error.value = err.response?.data?.detail || err.response?.data?.message || 'Terjadi kesalahan saat menganalisis target.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  // 3. Submit Feedback
  const submitFeedback = async (scanId, feedback) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.post('/feedback', {
        detection_history_id: scanId,
        label: feedback.proposedStatus,
        keterangan: feedback.keterangan
      })

      const feedbackRecord = {
        id: response.data.id || Date.now(),
        scanId,
        keterangan: feedback.keterangan,
        proposedStatus: feedback.proposedStatus,
        timestamp: new Date().toISOString(),
        status: 'pending' 
      }

      feedbackReports.value.unshift(feedbackRecord)
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || err.response?.data?.message || 'Gagal mengirim feedback.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // States
    scanHistory,
    feedbackReports,
    isLoading,
    error,
    currentScanResult,
    
    // Getters
    getRecentScans,
    
    // Actions
    fetchScanHistory,
    performScan,
    submitFeedback
  }
})