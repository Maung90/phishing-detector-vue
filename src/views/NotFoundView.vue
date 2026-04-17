<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="text-center fade-in">
      <div class="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-danger-500 to-danger-700 mb-6 shadow-lg shadow-danger-500/30">
        <AlertTriangle class="w-12 h-12 text-white" />
      </div>

      <h1 class="text-8xl font-bold mb-4 bg-gradient-to-r from-cyber-400 to-cyan-400 bg-clip-text text-transparent">
        404
      </h1>

      <h2 class="text-3xl font-bold text-white mb-4">
        Page Not Found
      </h2>

      <p class="text-slate-400 mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <RouterLink
        to="/login"
        class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyber-500 to-cyan-500 hover:from-cyber-600 hover:to-cyan-600 text-white font-semibold rounded-lg transition-all shadow-lg shadow-cyber-500/30"
      >
        <Home class="w-5 h-5" />
        Go to Login
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { AlertTriangle, Home } from 'lucide-vue-next'
</script>
