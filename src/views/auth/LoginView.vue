<template>
  <div class="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#fafcfc]">

    <div class="absolute inset-0 cyber-grid opacity-10"></div>
    <div class="absolute top-20 left-10 w-64 h-64 bg-[#2c63d1] rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
    <div class="absolute bottom-20 right-10 w-96 h-96 bg-[white] rounded-full filter blur-3xl opacity-5 animate-pulse-slow" style="animation-delay: 1s;"></div>

    <div class="w-full max-w-md relative z-10 fade-in">
      <div class="text-center mb-8 ">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-[#2c63d1] mb-4 shadow-lg shadow-secondary/30">
          <Shield class="w-10 h-10 text-white" />
        </div>
        <h1 class="text-4xl font-bold mb-2 text-black">
          SEQR
        </h1>
        <p class="text-black/60 font-mono text-sm">Advanced Quishing Detection Platform</p>
      </div>

      <div class="glass-effect rounded-2xl p-8 shadow-2xl bg-white/5 border border-black/10">
        <h2 class="text-2xl font-bold mb-6 text-[#2c63d1]">Sign In</h2>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-black/80 mb-2">
              Email Address
            </label>
            <div class="relative">
              <Mail class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
              <input
              v-model="username"
              type="text"
              required
              class="w-full pl-11 pr-4 py-3 bg-[#2c63d1]/50 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-black placeholder-black/40 transition-all"
              placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-black/80 mb-2">
              Password
            </label>
            <div class="relative">
              <Lock class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
              <input
              v-model="password"
              type="password"
              required
              class="w-full pl-11 pr-4 py-3 bg-[#2c63d1]/50 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-black placeholder-black/40 transition-all"
              placeholder="••••••••"
              />
            </div>
          </div>

          <div v-if="errorMessage" class="bg-[#FC0A0A]/10 border border-[#FC0A0A]/50 rounded-lg p-3 flex items-start gap-3">
            <AlertCircle class="w-5 h-5 text-[#FC0A0A] flex-shrink-0 mt-0.5" />
            <p class="text-sm text-[#FC0A0A]">{{ errorMessage }}</p>
          </div>

          <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 mt-4 hover:bg-opacity-90 text-black font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg border shadow-secondary/30"
          >
          <span v-if="!loading">Sign In</span>
          <span v-else class="loading-dots">Authenticating</span>
          <LogIn v-if="!loading" class="w-5 h-5" />
        </button>
      </form>

      <div class="mt-6 text-center">
        <p class="text-black/60 text-sm">
          Don't have an account?
          <RouterLink to="/register" class="text-secondary hover:text-black font-semibold transition-colors">
            Create one
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
import { Shield, Mail, Lock, LogIn, AlertCircle } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  loading.value = true
  errorMessage.value = ''

  const result = await authStore.login(username.value, password.value)
  if (result.success) {
    if (authStore.userRole === 'admin') {
      router.push('/admin')
    } else if (authStore.userRole === 'user') {
      router.push('/developer')
    } else {
      router.push('/scanner')
    }
  } else {
    errorMessage.value = result.error
  }

  loading.value = false
}
</script>
