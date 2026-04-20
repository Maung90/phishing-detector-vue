<template>
  <div class="min-h-screen">
    <Header />
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <WelcomeMessage title="User Feedback Reports" message="Review false detection reports submitted by users" />

      <div v-if="feedbackStore.isLoading" class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="w-12 h-12 border-4 border-[#FA1414] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-slate-400 font-mono">Mengambil data feedback dari server...</p>
      </div>

      <div v-else>

        <div v-if="feedbackStore.error" class="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
          <strong class="font-bold">Error! </strong>
          <span>{{ feedbackStore.error }}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 fade-in">
          <div class="glass-effect rounded-xl p-6 border border-[#FA1414]/50">
            <div class="text-3xl font-bold text-[#FA1414] mb-1">
              {{ feedbackStore.feedbacks.length }}
            </div>
            <div class="text-sm text-[#FA1414]">Total Reports</div>
          </div>
          <div class="glass-effect rounded-xl p-6 border border-[#232323]/50">
            <div class="text-3xl font-bold text-black mb-1">
              {{ pendingReports }}
            </div>
            <div class="text-sm text-[#222222]">Pending Review</div>
          </div>
        </div>

        <div class="glass-effect rounded-2xl shadow-2xl overflow-hidden fade-in border border-[#334155]/50">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-[#1e293b] border-b border-[#334155]">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Report ID</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Description</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Proposed Status</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Submitted</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#334155]/50">
                <tr
                v-for="report in feedbackStore.feedbacks"
                :key="report.id"
                class="hover:bg-[#1e293b]/30 transition-colors"
                >
                <td class="px-6 py-4">
                  <code class="text-sm font-mono text-black">
                    #{{ report.id }}
                  </code>
                </td>
                <td class="px-6 py-4">
                  <p class="text-sm text-black max-w-md">
                    {{ report.keterangan }}
                  </p>
                </td>
                <td class="px-6 py-4">
                  <span
                  :class="[
                  'inline-flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-xs',
                  report.label === 'phishing'
                  ? 'bg-danger-500/20 text-danger-300 border border-danger-500/50 text-red-400'
                  : 'bg-safe-500/20 text-safe-300 border border-safe-500/50 text-green-400'
                  ]"
                  >
                  {{ report.user_reported_label }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-400">
                {{ formatDate(report.timestamp || report.created_at) }}
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-xs bg-orange-500/20 text-orange-300 border border-orange-500/50">
                  <Clock class="w-3 h-3" />
                  {{ report.is_reviewed  == true ? 'reviewed' : 'unreviewed' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-400">
                <button class="p-2 text-white bg-[#2ab321] rounded cursor-pointer text-xs">
                  Detail
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="feedbackStore.feedbacks.length === 0 && !feedbackStore.error" class="text-center py-16">
        <MessageSquare class="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 class="text-xl font-semibold text-white mb-2">No Feedback Reports</h3>
        <p class="text-slate-400">User feedback will appear here</p>
      </div>
    </div>

  </div>
</div>
</div>
</template>

<script setup>
// 1. Pastikan onMounted di-import
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// 2. Ganti import dari scanner ke feedback
import { useFeedbackStore } from '@/stores/feedback'
import { Header, Navbar, WelcomeMessage, StatCard, QuickAction, UsageChart, ActivateCard } from './components'
import {
  Shield, LogOut, LayoutDashboard, Brain, MessageSquare, History, Clock
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// 3. Inisialisasi Store Feedback
const feedbackStore = useFeedbackStore()

// 4. Panggil API saat halaman dimuat
onMounted(async () => {
  await feedbackStore.fetchAdminFeedback()
})

// 5. Sesuaikan computed property
const pendingReports = computed(() =>
  feedbackStore.feedbacks.filter(r => r.status === 'pending').length
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
  if (!dateString) return '-'
    return new Date(dateString).toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
}
</script>
