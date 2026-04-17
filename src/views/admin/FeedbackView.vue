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
          <RouterLink to="/admin" :class="navClass('/admin')">
            <div class="flex items-center gap-2">
              <LayoutDashboard class="w-4 h-4" />
              <span class="hidden sm:inline">Dashboard</span>
            </div>
          </RouterLink>
          <RouterLink to="/admin/models" :class="navClass('/admin/models')">
            <div class="flex items-center gap-2">
              <Brain class="w-4 h-4" />
              <span class="hidden sm:inline">Models</span>
            </div>
          </RouterLink>
          <RouterLink to="/admin/feedback" :class="navClass('/admin/feedback')">
            <div class="flex items-center gap-2">
              <MessageSquare class="w-4 h-4" />
              <span class="hidden sm:inline">Feedback</span>
            </div>
          </RouterLink>
          <RouterLink to="/admin/history" :class="navClass('/admin/history')">
            <div class="flex items-center gap-2">
              <History class="w-4 h-4" />
              <span class="hidden sm:inline">History</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8 fade-in">
        <h2 class="text-3xl font-bold text-white mb-2">User Feedback Reports</h2>
        <p class="text-slate-400">
          Review false detection reports submitted by users
        </p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 fade-in">
        <div class="glass-effect rounded-xl p-6 border border-slate-700/50">
          <div class="text-3xl font-bold text-white mb-1">
            {{ scannerStore.feedbackReports.length }}
          </div>
          <div class="text-sm text-slate-400">Total Reports</div>
        </div>
        <div class="glass-effect rounded-xl p-6 border border-slate-700/50">
          <div class="text-3xl font-bold text-white mb-1">
            {{ pendingReports }}
          </div>
          <div class="text-sm text-slate-400">Pending Review</div>
        </div>
        <div class="glass-effect rounded-xl p-6 border border-slate-700/50">
          <div class="text-3xl font-bold text-white mb-1">
            2.3%
          </div>
          <div class="text-sm text-slate-400">False Positive Rate</div>
        </div>
      </div>

      <!-- Feedback Table -->
      <div class="glass-effect rounded-2xl shadow-2xl overflow-hidden fade-in">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-slate-800/50 border-b border-slate-700">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Report ID
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Proposed Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Submitted
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-700/50">
              <tr
                v-for="report in scannerStore.feedbackReports"
                :key="report.id"
                class="hover:bg-slate-800/30 transition-colors"
              >
                <td class="px-6 py-4">
                  <code class="text-sm font-mono text-cyan-400">
                    #{{ report.id }}
                  </code>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-white max-w-md">
                    {{ report.keterangan }}
                  </p>
                </td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'inline-flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-xs',
                      report.proposedStatus === 'Phishing'
                        ? 'bg-danger-500/20 text-danger-300 border border-danger-500/50'
                        : 'bg-safe-500/20 text-safe-300 border border-safe-500/50'
                    ]"
                  >
                    {{ report.proposedStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-400">
                  {{ formatDate(report.timestamp) }}
                </td>
                <td class="px-6 py-4">
                  <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-xs bg-orange-500/20 text-orange-300 border border-orange-500/50">
                    <Clock class="w-3 h-3" />
                    {{ report.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="scannerStore.feedbackReports.length === 0" class="text-center py-16">
          <MessageSquare class="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 class="text-xl font-semibold text-white mb-2">No Feedback Reports</h3>
          <p class="text-slate-400">User feedback will appear here</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useScannerStore } from '@/stores/scanner'
import {
  Shield, LogOut, LayoutDashboard, Brain, MessageSquare, History, Clock
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const scannerStore = useScannerStore()

const pendingReports = computed(() =>
  scannerStore.feedbackReports.filter(r => r.status === 'pending').length
)

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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
