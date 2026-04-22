import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../../utils/axios'

export const useAdminDashboardStore = defineStore('adminDashboard', () => {
  // --- STATE ---
  const kpi = ref({
    total_detections: 0,
    phishing_detected: 0,
    total_users: 0,
    pending_reviews: 0
  })
  const isLoading = ref(false)
  const error = ref(null)

  // --- ACTIONS ---
  const fetchAdminKpi = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/dashboard/admin/kpi')
      if (response.data && response.data.kpi) {
        kpi.value = response.data.kpi
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Gagal mengambil data KPI Admin.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    kpi,
    isLoading,
    error,
    fetchAdminKpi
  }
})