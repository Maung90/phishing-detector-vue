<script setup>
import { Shield, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header
    class=" backdrop-blur-md transition-all"
    style="background: rgba(255, 255, 255, 0.85); border-bottom: 1px solid rgba(44, 99, 209, 0.08);"
  >
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">

        <div class="flex items-center gap-3">
          <div
            class="w-10 h-10 rounded-xl flex items-center justify-center"
            style="background: #2c63d1; box-shadow: 0 4px 14px rgba(44, 99, 209, 0.35);"
          >
            <Shield class="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-extrabold tracking-tight" style="color: #0f1b3d;">SEQR Admin</h1>
            <p class="text-xs font-mono" style="color: #6b7fa3;">System Management</p>
          </div>
        </div>

        <button
          @click="handleLogout"
          class="p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center group"
          style="color: #6b7fa3;"
          @mouseenter="e => { e.currentTarget.style.background = 'rgba(220, 38, 38, 0.08)'; e.currentTarget.style.color = '#dc2626'; }"
          @mouseleave="e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6b7fa3'; }"
          title="Logout"
        >
          <LogOut class="w-5 h-5" />
        </button>

      </div>
    </div>
  </header>
</template>

<style scoped>
h1 {
  font-family: 'Plus Jakarta Sans', sans-serif;
}
p {
  font-family: 'JetBrains Mono', monospace;
}
</style>
