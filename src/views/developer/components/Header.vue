<script setup>
import {
  Shield, LogOut, LayoutDashboard, Key
} from 'lucide-vue-next'
</script>
<template>
  <header class="glass-effect border-b border-white/10 sticky top-0 z-40 bg-[#2c63d1]/80 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#2c63d1] flex items-center justify-center shadow-lg shadow-secondary/20">
            <Shield class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-white">SEQR Developer</h1>
            <p class="text-xs text-white/60 font-mono">Manajemen API</p>
          </div>
        </div>
        <button
        @click="handleLogout"
        class="p-2 hover:bg-white/10 rounded-lg transition-colors"
        title="Keluar"
        >
        <LogOut class="w-5 h-5 text-white/60 hover:text-secondary" />
      </button>
    </div>
  </div>
</header>
</template>
