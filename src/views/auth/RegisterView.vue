<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Animated background -->
    <div class="absolute inset-0 cyber-grid opacity-20"></div>
    <div class="absolute top-20 left-10 w-64 h-64 bg-cyber-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-safe-500 rounded-full filter blur-3xl opacity-10 animate-pulse-slow" style="animation-delay: 1s;"></div>

    <div class="w-full max-w-md relative z-10 fade-in">
      <!-- Logo and Header -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyber-500 to-cyber-700 mb-4 shadow-lg shadow-cyber-500/30">
          <Shield class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-4xl font-bold mb-2 bg-gradient-to-r from-cyber-400 to-cyan-400 bg-clip-text text-transparent">
          SEQR
        </h1>
        <p class="text-slate-400 font-mono text-sm">Create Your Account</p>
      </div>

      <!-- Register Card -->
      <div class="glass-effect rounded-2xl p-8 shadow-2xl">
        <h2 class="text-2xl font-bold mb-6 text-white">Sign Up</h2>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <!-- Name Input -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Full Name
            </label>
            <div class="relative">
              <User class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                v-model="name"
                type="text"
                required
                class="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                placeholder="John Doe"
              />
            </div>
          </div>

          <!-- Email Input -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Email Address
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                v-model="email"
                type="email"
                required
                class="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                v-model="password"
                type="password"
                required
                minlength="6"
                class="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyber-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            <p class="mt-1 text-xs text-slate-500">Minimum 6 characters</p>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="bg-danger-500/10 border border-danger-500/50 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle class="w-5 h-5 text-danger-400 flex-shrink-0 mt-0.5" />
            <p class="text-sm text-danger-300">{{ errorMessage }}</p>
          </div>

          <!-- Register Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-gradient-to-r from-cyber-500 to-cyan-500 hover:from-cyber-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyber-500/30"
          >
            <span v-if="!loading">Create Account</span>
            <span v-else class="loading-dots">Creating Account</span>
            <UserPlus v-if="!loading" class="w-5 h-5" />
          </button>
        </form>

        <!-- Login Link -->
        <div class="mt-6 text-center">
          <p class="text-slate-400 text-sm">
            Already have an account?
            <RouterLink to="/login" class="text-cyber-400 hover:text-cyber-300 font-semibold transition-colors">
              Sign in
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Shield, Mail, Lock, User, UserPlus, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleRegister = async () => {
  loading.value = true
  errorMessage.value = ''

  const result = await authStore.register(name.value, email.value, password.value)

  if (result.success) {
    router.push('/scanner')
  } else {
    errorMessage.value = result.error
  }

  loading.value = false
}
</script>
