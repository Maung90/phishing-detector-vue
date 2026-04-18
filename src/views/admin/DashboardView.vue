<template>
  <div class="min-h-screen">

    <Header />
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Welcome -->
      <WelcomeMessage title="Dashboard Admin" message="Here’s a quick overview of your dashboard and recent activity."/>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 fade-in">

        <StatCard
        v-for="(card, index) in statCards"
        :key="index"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :color="card.color"
        />
      </div>

      <!-- System Status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 fade-in">
        <!-- Active Models -->
        <ActivateCard  :models="adminStore.activeModels"/>
    </div>

<QuickAction/>
</div>
</div>
</template>

<script setup>
import { Header, Navbar, WelcomeMessage, StatCard, QuickAction, UsageChart, ActivateCard } from './components'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import {
  Shield, LogOut, LayoutDashboard, Brain, MessageSquare, History,
  Activity, Users, TrendingUp, AlertTriangle, Zap, Plus, Download,
  ArrowRight
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const adminStore = useAdminStore()
import { useApiStore } from '@/stores/api'
const apiStore = useApiStore()

const stats = computed(() => apiStore.getKeyStats())
import { computed } from 'vue'

const recentActivity = [
{ action: 'New ML model deployed: Neural Network v1.5.2', time: '5 minutes ago' },
{ action: 'User feedback received for scan #8472', time: '12 minutes ago' },
{ action: 'System health check completed', time: '1 hour ago' },
{ action: 'API key created by dev@seqr.com', time: '2 hours ago' },
{ action: '1,000+ scans processed today', time: '3 hours ago' }
]


const statCards = computed(() => [
{
  title: 'Total Scans',
  value: stats.value.totalKeys,
  icon: Activity,
  color: '#2c63d1'
},
{
  title: 'Total Users',
  value: stats.value.totalRequests.toLocaleString(),
  icon: Users,
  color: '#22c55e'
},
{
  title: 'Active Models',
  value: '2.3ms',
  icon: Brain,
  color: '#a855f7'
},
{
  title: 'Detection Rate',
  value: '99.8%',
  icon: TrendingUp,
  color: '#f97316'
},
{
  title: 'False Positive Rate',
  value: '99.8%',
  icon: AlertTriangle,
  color: '#f97316'
},
{
  title: 'System Health',
  value: '99.8%',
  icon: Zap,
  color: '#f97316'
}
])
const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
