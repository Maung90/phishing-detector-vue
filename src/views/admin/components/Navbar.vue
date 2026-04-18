<script setup>
import {
  LayoutDashboard,
  Brain,
  MessageSquare,
  History
} from 'lucide-vue-next'

import { useRoute } from 'vue-router'
const route = useRoute()
const navClass = (path) => {
  return [
  'px-4 py-3 font-medium transition-all whitespace-nowrap',
  route.path.startsWith(path)
  ? 'text-[#2c63d1]'
  : 'text-black'
]
}

const menus = [
{ name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
{ name: 'Models', path: '/admin/models', icon: Brain },
{ name: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
{ name: 'History', path: '/admin/history', icon: History }
]

</script>

<template>
 <!-- Navigation -->
  <nav class="glass-effect border-b border-white/10 bg-[#2c63d1]/50">
  <div class="max-w-7xl mx-auto px-4">
    <div class="flex gap-1 overflow-x-auto">
      <RouterLink
      v-for="menu in menus"
      :key="menu.path"
      :to="menu.path"
      v-slot="{ isActive }"
      >
      <div :class="[
      'px-4 py-3 font-medium transition-all whitespace-nowrap flex items-center gap-2',
      isActive ? 'text-[#2c63d1]' : 'text-black'
      ]">
      <component :is="menu.icon" class="w-4 h-4" />
      <span class="hidden sm:inline">{{ menu.name }}</span>
    </div>
  </RouterLink>
</div>
</div>
</nav>
</template>
