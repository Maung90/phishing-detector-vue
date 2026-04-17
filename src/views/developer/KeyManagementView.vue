<template>
  <div class="min-h-screen bg-primary">
    <Header />
    <Navbar/>
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Welcome -->
      <WelcomeMessage message="Pantau penggunaan API Anda dan kelola kunci akses" :name="authStore.user?.name || null"/>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
        <StatCard
        v-for="(card, index) in statCards"
        :key="index"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :color="card.color"
        />
      </div>

      <QuickAction />
</div>
</div>
</template>

<script setup>
import { Header, Navbar, WelcomeMessage, StatCard, QuickAction } from './components'

import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useApiStore } from '@/stores/api'
import {
  Key, Activity, Zap,
  TrendingUp, BarChart3, Plus, FileText
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const apiStore = useApiStore()

const stats = computed(() => apiStore.getKeyStats())

const statCards = [
{
  title: 'Kunci API Aktif',
  value: stats.value.totalKeys,
  icon: Key,
  color: '#2c63d1'
},
{
  title: 'Total Permintaan',
  value: stats.value.totalRequests.toLocaleString(),
  icon: Activity,
  color: '#22c55e'
},
{
  title: 'Rata-rata Respons',
  value: '2.3ms',
  icon: Zap,
  color: '#a855f7'
},
{
  title: 'Waktu Aktif API',
  value: '99.8%',
  icon: TrendingUp,
  color: '#f97316'
}
]
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
