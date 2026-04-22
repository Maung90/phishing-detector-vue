import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '../../utils/axios'

export const useUserDashboardStore = defineStore('userDashboard', () => {
  // --- STATE ---
  const kpi = ref({
    total_scans: 0,
    phishing_blocked: 0,
    active_api_keys: 0
  })
  const isLoading = ref(false)
  const error = ref(null)

  // --- ACTIONS ---
  const fetchUserKpi = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.get('/dashboard/user/kpi')

      if (response.data && response.data.kpi) {
        kpi.value = response.data.kpi
      }
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.detail || 'Gagal mengambil data KPI User.'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  return {
    kpi,
    isLoading,
    error,
    fetchUserKpi
  }
})