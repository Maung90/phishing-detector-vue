<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="glass-effect border-b border-slate-700/50 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-danger-500 to-danger-700 flex items-center justify-center">
              <Shield class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">SEQR Admin</h1>
              <p class="text-xs text-slate-400 font-mono">System Management</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut class="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="glass-effect border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex gap-1 overflow-x-auto">
          <RouterLink
            to="/admin"
            :class="navClass('/admin')"
          >
            <div class="flex items-center gap-2">
              <LayoutDashboard class="w-4 h-4" />
              <span class="hidden sm:inline">Dashboard</span>
            </div>
          </RouterLink>
          <RouterLink
            to="/admin/models"
            :class="navClass('/admin/models')"
          >
            <div class="flex items-center gap-2">
              <Brain class="w-4 h-4" />
              <span class="hidden sm:inline">Models</span>
            </div>
          </RouterLink>
          <RouterLink
            to="/admin/feedback"
            :class="navClass('/admin/feedback')"
          >
            <div class="flex items-center gap-2">
              <MessageSquare class="w-4 h-4" />
              <span class="hidden sm:inline">Feedback</span>
            </div>
          </RouterLink>
          <RouterLink
            to="/admin/history"
            :class="navClass('/admin/history')"
          >
            <div class="flex items-center gap-2">
              <History class="w-4 h-4" />
              <span class="hidden sm:inline">History</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Welcome -->
      <div class="mb-8 fade-in">
        <h2 class="text-3xl font-bold text-white mb-2">
          Admin Dashboard
        </h2>
        <p class="text-slate-400">
          System overview and analytics
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 fade-in">
        <div class="glass-effect rounded-xl p-6 border border-slate-700/50">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-cyber-500/20 flex items-center justify-center">
              <Activity class="w-6 h-6 text-cyber-400" />
            </div>
            <span class="text-xs font-semibold text-safe-400 bg-safe-500/20 px-2 py-1 rounded">
              +12.5%
            </span>
          </div>
          <div class="text-3xl font-bold text-white mb-1">
            {{ adminStore.systemStats.totalScans.toLocaleString() }}
          </div>
          <div class="text-sm text-slate-400">Total Scans</div>
        </div>

        <div class="glass-effect rounded-xl p-6 border border-slate-700/50">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Users class="w-6 h-6 text-purple-400" />
            </div>
            <span class="text-xs font-semibold text-safe-400 bg-safe-500/20 px-2 py-1 rounded">
              +8.3%
            </span>
          </div>
          <div class="text-3xl font-bold text-white mb-1">
            {{ adminStore.systemStats.totalUsers.toLocaleString() }}
          </div>
          <div class="text-sm text-slate-400">Total Users</div>
        </div>

        <div class="glass-effect rounded-xl p-6 border border-slate-700/50">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Brain class="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <div class="text-3xl font-bold text-white mb-1">
            {{ adminStore.systemStats.activeModels }}
          </div>
          <div class="text-sm text-slate-400">Active Models</div>
        </div>

        <div class="glass-effect rounded-xl p-6 border border-slate-700/50">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-safe-500/20 flex items-center justify-center">
              <TrendingUp class="w-6 h-6 text-safe-400" />
            </div>
          </div>
          <div class="text-3xl font-bold text-white mb-1">
            {{ adminStore.systemStats.threatDetectionRate }}%
          </div>
          <div class="text-sm text-slate-400">Detection Rate</div>
        </div>

        <div class="glass-effect rounded-xl p-6 border border-slate-700/50">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-danger-500/20 flex items-center justify-center">
              <AlertTriangle class="w-6 h-6 text-danger-400" />
            </div>
          </div>
          <div class="text-3xl font-bold text-white mb-1">
            {{ adminStore.systemStats.falsePositiveRate }}%
          </div>
          <div class="text-sm text-slate-400">False Positive Rate</div>
        </div>

        <div class="glass-effect rounded-xl p-6 border border-slate-700/50">
          <div class="flex items-center justify-between mb-4">
            <div class="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Zap class="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div class="text-3xl font-bold text-white mb-1">
            {{ adminStore.systemStats.systemHealth }}%
          </div>
          <div class="text-sm text-slate-400">System Health</div>
        </div>
      </div>

      <!-- System Status -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 fade-in">
        <!-- Active Models -->
        <div class="glass-effect rounded-2xl p-8 shadow-2xl">
          <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Brain class="w-6 h-6 text-cyber-400" />
            Active ML Models
          </h3>
          <div class="space-y-4">
            <div
              v-for="model in adminStore.activeModels"
              :key="model.id"
              class="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50"
            >
              <div class="flex items-start justify-between mb-2">
                <div>
                  <h4 class="font-semibold text-white">{{ model.name }}</h4>
                  <p class="text-sm text-slate-400">{{ model.type }}</p>
                </div>
                <span class="text-xs font-semibold text-safe-400 bg-safe-500/20 px-2 py-1 rounded">
                  {{ model.accuracy }}% accuracy
                </span>
              </div>
            </div>
          </div>
          <RouterLink
            to="/admin/models"
            class="mt-4 text-cyber-400 hover:text-cyber-300 text-sm font-semibold flex items-center gap-2"
          >
            Manage Models
            <ArrowRight class="w-4 h-4" />
          </RouterLink>
        </div>

        <!-- Recent Activity -->
        <div class="glass-effect rounded-2xl p-8 shadow-2xl">
          <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity class="w-6 h-6 text-cyber-400" />
            Recent Activity
          </h3>
          <div class="space-y-4">
            <div
              v-for="(activity, i) in recentActivity"
              :key="i"
              class="flex items-start gap-3"
            >
              <div class="w-2 h-2 rounded-full bg-cyber-400 mt-2"></div>
              <div class="flex-1">
                <p class="text-sm text-white">{{ activity.action }}</p>
                <p class="text-xs text-slate-500">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="glass-effect rounded-2xl p-8 shadow-2xl fade-in">
        <h3 class="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <RouterLink
            to="/admin/models"
            class="p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all group text-center"
          >
            <div class="w-12 h-12 rounded-lg bg-cyber-500/20 flex items-center justify-center group-hover:bg-cyber-500/30 transition-colors mx-auto mb-3">
              <Plus class="w-6 h-6 text-cyber-400" />
            </div>
            <h4 class="font-semibold text-white mb-1">Add Model</h4>
            <p class="text-xs text-slate-400">Deploy new ML model</p>
          </RouterLink>

          <RouterLink
            to="/admin/feedback"
            class="p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all group text-center"
          >
            <div class="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500/30 transition-colors mx-auto mb-3">
              <MessageSquare class="w-6 h-6 text-purple-400" />
            </div>
            <h4 class="font-semibold text-white mb-1">View Feedback</h4>
            <p class="text-xs text-slate-400">User reports</p>
          </RouterLink>

          <RouterLink
            to="/admin/history"
            class="p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all group text-center"
          >
            <div class="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center group-hover:bg-orange-500/30 transition-colors mx-auto mb-3">
              <History class="w-6 h-6 text-orange-400" />
            </div>
            <h4 class="font-semibold text-white mb-1">Scan History</h4>
            <p class="text-xs text-slate-400">All detections</p>
          </RouterLink>

          <button
            class="p-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all group text-center"
          >
            <div class="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors mx-auto mb-3">
              <Download class="w-6 h-6 text-green-400" />
            </div>
            <h4 class="font-semibold text-white mb-1">Export Data</h4>
            <p class="text-xs text-slate-400">Generate reports</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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

const recentActivity = [
  { action: 'New ML model deployed: Neural Network v1.5.2', time: '5 minutes ago' },
  { action: 'User feedback received for scan #8472', time: '12 minutes ago' },
  { action: 'System health check completed', time: '1 hour ago' },
  { action: 'API key created by dev@seqr.com', time: '2 hours ago' },
  { action: '1,000+ scans processed today', time: '3 hours ago' }
]

const navClass = (path) => {
  return [
    'px-4 py-3 font-medium transition-all whitespace-nowrap',
    route.path === path
      ? 'text-danger-400 border-b-2 border-danger-400'
      : 'text-slate-400 hover:text-white'
  ]
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>
