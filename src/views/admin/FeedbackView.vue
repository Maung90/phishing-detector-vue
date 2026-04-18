<template>
  <div class="min-h-screen">

    <Header />
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <WelcomeMessage title="User Feedback Reports" message="Review false detection reports submitted by users" />

      <!-- Stats -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 fade-in">
        <div class="glass-effect rounded-xl p-6 border border-[#FA1414]/50">
          <div class="text-3xl font-bold text-[#FA1414] mb-1">
            {{ scannerStore.feedbackReports.length }}
          </div>
          <div class="text-sm text-[#FA1414]">Total Reports</div>
        </div>
        <div class="glass-effect rounded-xl p-6 border border-[#232323]/50">
          <div class="text-3xl font-bold text-black mb-1">
            {{ pendingReports }}
          </div>
          <div class="text-sm text-[#222222]">Pending Review</div>
        </div>
        <div class="glass-effect rounded-xl p-6 border border-[#232323]/50">
          <div class="text-3xl font-bold text-black mb-1">
            2.3%
          </div>
          <div class="text-sm text-[#222222]">False Positive Rate</div>
        </div>
      </div>

      <!-- Feedback Table -->
      <div class="glass-effect rounded-2xl shadow-2xl overflow-hidden fade-in">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#1e293b] border-b border-[#334155]">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Report ID
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Proposed Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Submitted
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#334155]/50">
              <tr
                v-for="report in scannerStore.feedbackReports"
                :key="report.id"
                class="hover:bg-[#1e293b]/30 transition-colors"
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
import { Header, Navbar, WelcomeMessage, StatCard, QuickAction, UsageChart, ActivateCard } from './components'
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
