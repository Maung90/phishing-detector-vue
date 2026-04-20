<script setup>
import {
  LayoutDashboard, Key
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>

  <nav class="glass-effect border-b border-white/10 bg-[#2c63d1]/50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex gap-1 overflow-x-auto">
        <RouterLink
        to="/developer"
        :class="[
        'px-4 py-3 font-medium transition-all whitespace-nowrap',
        route.path === '/developer'
        ? 'text-secondary border-b-2 border-secondary'
        : 'text-white/60 hover:text-white'
        ]"
        >
        <div class="flex items-center gap-2">
          <LayoutDashboard class="w-4 h-4" />
          Dashboard
        </div>
      </RouterLink>
      <RouterLink
      to="/developer/keys"
      :class="[
      'px-4 py-3 font-medium transition-all whitespace-nowrap',
      $route.path === '/developer/keys'
      ? 'text-secondary border-b-2 border-secondary'
      : 'text-white/60 hover:text-white'
      ]"
      >
      <div class="flex items-center gap-2">
        <Key class="w-4 h-4" />
        Keys API
      </div>
    </RouterLink>
  </div>
</div>
</nav>
</template>
