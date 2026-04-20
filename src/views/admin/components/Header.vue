<script setup>
import {
  Shield, LogOut
} from 'lucide-vue-next'

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
    <!-- Header -->
  <header class="glass-effect border-b border-white/10 sticky top-0 z-40 bg-[#2c63d1]/80 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-[#2c63d1] flex items-center justify-center">
              <Shield class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-black">SEQR Admin</h1>
              <p class="text-xs text-black/59 font-mono">System Management</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="p-2 hover:bg-[#2c63d1] rounded-lg transition-colors cursor-pointer"
            title="Logout"
          >
            <LogOut class="w-5 h-5 text-black" />
          </button>
        </div>
      </div>
    </header>
</template>
