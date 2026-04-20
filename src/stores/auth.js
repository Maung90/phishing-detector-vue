import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../utils/axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  
  const isLoading = ref(false)
  const error = ref(null)

  const userRole = computed(() => user.value?.role || null)


  const login = async (username, password) => {
    isLoading.value = true
    error.value = null
    try {
      const formData = new URLSearchParams()

      formData.append('username', username) 
      formData.append('password', password)
      
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      
      const access_token = response.data.access_token
      localStorage.setItem('access_token', access_token)
      isAuthenticated.value = true

      const profileResponse = await api.get('/auth/me')
      user.value = profileResponse.data
      localStorage.setItem('seqr_user', JSON.stringify(user.value))
            
      return { success: true, data : profileResponse.data}
    } catch (err) {
      // Tangkap pesan error dari backend, atau gunakan pesan default
      error.value = err.response?.data?.message || 'Email atau password salah'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name, email, password) => {
    isLoading.value = true
    error.value = null
    try {
      const response = await api.post('/auth/register', { name, email, password })
      
      // Biasanya setelah register, backend langsung auto-login dan mengembalikan token
      const { access_token, user: userData } = response.data
      
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('seqr_user', JSON.stringify(userData))
      
      user.value = userData
      isAuthenticated.value = true
      
      return { success: true }
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal melakukan registrasi'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      // Opsional: Beritahu backend untuk mematikan/invalidate token di sisi server
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Bersihkan state
      user.value = null
      isAuthenticated.value = false
      // Bersihkan local storage
      localStorage.removeItem('access_token')
      localStorage.removeItem('seqr_user')
    }
  }

  // initAuth dijalankan saat aplikasi pertama kali dimuat (misal di App.vue)
  const initAuth = async () => {
    const token = localStorage.getItem('access_token')
    const savedUser = localStorage.getItem('seqr_user')
    
    // Set state awal dari cache agar UI tidak berkedip (flicker)
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }

    if (token) {
      // Best Practice: Validasi token ke backend untuk memastikan belum expired
      // dan ambil data user terbaru untuk meng-update cache.
      try {
        const response = await api.get('/auth/me') // Sesuaikan endpoint user profile
        user.value = response.data.user
        isAuthenticated.value = true
        // Perbarui data lokal jika ada perubahan (misal user ganti nama)
        localStorage.setItem('seqr_user', JSON.stringify(user.value))
      } catch (err) {
        // Jika token tidak valid / expired (biasanya kena error 401 Unauthorized)
        console.warn('Sesi telah berakhir')
        logout() // Paksa logout untuk membersihkan sisa data invalid
      }
    } else {
      logout() // Pastikan bersih jika tidak ada token sama sekali
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    userRole,
    login,
    register,
    logout,
    initAuth
  }
})