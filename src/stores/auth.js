import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)

  // Mock users database
  const users = ref([
    { 
      id: 1, 
      email: 'guest@seqr.com', 
      password: '123', 
      role: 'guest',
      name: 'Guest User'
    },
    { 
      id: 2, 
      email: 'dev@seqr.com', 
      password: '123', 
      role: 'developer',
      name: 'Developer'
    },
    { 
      id: 3, 
      email: 'admin@seqr.com', 
      password: '123', 
      role: 'admin',
      name: 'Admin Master'
    }
  ])

  const login = async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const foundUser = users.value.find(
      u => u.email === email && u.password === password
    )
    
    if (foundUser) {
      user.value = { ...foundUser }
      delete user.value.password
      isAuthenticated.value = true
      localStorage.setItem('seqr_user', JSON.stringify(user.value))
      return { success: true }
    }
    
    return { success: false, error: 'Invalid credentials' }
  }

  const register = async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (users.value.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' }
    }
    
    const newUser = {
      id: users.value.length + 1,
      email,
      name,
      role: 'guest', // Default role for new registrations
    }
    
    users.value.push({ ...newUser, password })
    user.value = newUser
    isAuthenticated.value = true
    localStorage.setItem('seqr_user', JSON.stringify(user.value))
    return { success: true }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('seqr_user')
  }

  const initAuth = () => {
    const savedUser = localStorage.getItem('seqr_user')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  }

  const userRole = computed(() => user.value?.role || null)

  return {
    user,
    isAuthenticated,
    userRole,
    login,
    register,
    logout,
    initAuth
  }
})