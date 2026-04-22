<template>
  <div class="min-h-screen pb-10">
    <Header />
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <WelcomeMessage title="User Feedback Reports" message="Review false detection reports submitted by users" />

      <div v-if="feedbackStore.isLoading" class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="w-12 h-12 border-4 border-[#FA1414] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-slate-400 font-mono">Mengambil data dari server...</p>
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
            <div class="text-3xl font-bold text-black/80 mb-1">
              {{ pendingReports }}
            </div>
            <div class="text-sm text-slate-400">Pending Review</div>
          </div>
          <div class="glass-effect rounded-xl p-6 border border-[#232323]/50">
            <div class="text-3xl font-bold text-green-700 mb-1">
              {{ reviewedReports }}
            </div>
            <div class="text-sm text-slate-400">Telah Direview</div>
          </div>
        </div>

        <div class="glass-effect rounded-2xl shadow-2xl overflow-hidden fade-in border border-[#334155]/50">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-[#1e293b] border-b border-[#334155]">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Report ID</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Keterangan</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Laporan User</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-center text-xs font-semibold text-[#94a3b8] uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#334155]/50">
                <tr v-for="report in feedbackStore.feedbacks" :key="report.id" class="hover:bg-[#1e293b]/30 transition-colors">
                  <td class="px-6 py-4">
                    <code class="text-sm font-mono text-cyan-400">{{ report.id }}</code>
                  </td>
                  <td class="px-6 py-4">
                    <p class="text-sm text-black max-w-xs truncate">{{ report.keterangan }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                    'inline-flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-xs border uppercase',
                    report.user_reported_label.toLowerCase() === 'phishing'
                    ? 'bg-red-500/20 text-red-300 border-red-500/50'
                    : 'bg-green-500/20 text-green-800 border-green-500/50'
                    ]">
                    {{ report.user_reported_label }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <span :class="[
                  'inline-flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-xs border uppercase',
                  report.is_reviewed
                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                  : 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                  ]">
                  <component :is="report.is_reviewed ? CheckCircle : Clock" class="w-3 h-3" />
                  {{ report.is_reviewed ? 'Direview' : 'Pending' }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <button
                @click="openDetailModal(report.id)"
                class="px-3 py-1 bg-[#2c63d1]/10 hover:bg-[#2c63d1]/20 text-[#2c63d1] rounded-lg text-sm font-semibold transition-colors"
                >
                Detail
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="feedbackStore.feedbacks.length === 0 && !feedbackStore.error" class="text-center py-16">
      <MessageSquare class="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-white mb-2">Belum Ada Laporan</h3>
      <p class="text-slate-400">Feedback dari user akan muncul di sini</p>
    </div>
  </div>
</div>
</div>

<div
v-if="showDetailModal"
class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in"
@click.self="closeDetailModal"
>
<div class="glass-effect rounded-2xl p-8 max-w-2xl w-full shadow-2xl bg-[#1e293b] border border-[#334155]">
  <div class="flex justify-between items-center mb-6 border-b border-[#334155] pb-4">
    <h3 class="text-2xl font-bold text-white">Detail Feedback</h3>
    <button @click="closeDetailModal" class="text-slate-400 hover:text-white font-bold text-xl">&times;</button>
  </div>

  <div v-if="isFetchingDetail" class="flex justify-center py-10">
    <div class="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else-if="detailError" class="text-red-400 bg-red-500/10 border border-red-500/50 p-4 rounded-lg">
    {{ detailError }}
  </div>

  <div v-else-if="selectedDetail" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-black/30 p-4 rounded-lg border border-white/5">
        <p class="text-xs text-slate-400 mb-1">Prediksi AI Awal</p>
        <p class="font-bold text-white uppercase">{{ selectedDetail.ai_prediction }}</p>
      </div>
      <div class="bg-black/30 p-4 rounded-lg border border-white/5">
        <p class="text-xs text-slate-400 mb-1">Laporan User (Label yang Benar)</p>
        <p class="font-bold text-cyan-400 uppercase">{{ selectedDetail.user_reported_label }}</p>
      </div>
    </div>

    <div class="bg-black/30 p-4 rounded-lg border border-white/5 my-1">
      <p class="text-xs text-slate-400 mb-1">Target URL Pemindaian</p>
      <p class="font-mono text-sm break-all text-white">{{ selectedDetail.target_url }}</p>
    </div>

    <div class="bg-black/30 p-4 rounded-lg border border-white/5 my-1">
      <p class="text-xs text-slate-400 mb-1">Pesan / Keterangan dari User</p>
      <p class="text-sm text-white/90 italic">"{{ selectedDetail.keterangan }}"</p>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div class="bg-black/30 p-4 rounded-lg border border-white/5">
        <p class="text-xs text-slate-400 mb-1">Dilaporkan Pada</p>
        <p class="text-sm text-white">{{ new Date(selectedDetail.created_at).toLocaleString('id-ID') }}</p>
      </div>
      <div class="bg-black/30 p-4 rounded-lg border border-white/5">
        <p class="text-xs text-slate-400 mb-1">Status Peninjauan</p>
        <span :class="selectedDetail.is_reviewed ? 'text-blue-400 font-bold' : 'text-orange-400 font-bold'">
          {{ selectedDetail.is_reviewed ? 'TELAH DIREVIEW' : 'PENDING' }}
        </span>
      </div>
    </div>
  </div>

  <div class="mt-8 flex gap-3 justify-end">
    <button @click="closeDetailModal" class="px-6 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors">
      Tutup
    </button>

    <button
    v-if="selectedDetail && !selectedDetail.is_reviewed"
    @click="handleReview(selectedDetail.id)"
    :disabled="isUpdating"
    class="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
    >
    <span v-if="!isUpdating">Tandai Telah Direview</span>
    <span v-else class="loading-dots">Memproses</span>
  </button>
</div>
</div>
</div>

</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFeedbackStore } from '@/stores/admin/feedback'
import { MessageSquare, Clock, CheckCircle } from 'lucide-vue-next'
import { Header, Navbar, WelcomeMessage } from './components'

const feedbackStore = useFeedbackStore()
const router = useRouter()

// State Modal
const showDetailModal = ref(false)
const isFetchingDetail = ref(false)
const isUpdating = ref(false)
const selectedDetail = ref(null)
const detailError = ref('')

// Hitungan Statistik
const pendingReports = computed(() =>
  feedbackStore.feedbacks.filter(r => r.is_reviewed === false).length
  )
const reviewedReports = computed(() =>
  feedbackStore.feedbacks.filter(r => r.is_reviewed === true).length
  )

// Panggil saat halaman dibuka
onMounted(async () => {
  await feedbackStore.fetchAdminFeedback()
})

// Buka Modal & Ambil Detail
const openDetailModal = async (id) => {
  showDetailModal.value = true
  isFetchingDetail.value = true
  selectedDetail.value = null
  detailError.value = ''

  const result = await feedbackStore.fetchFeedbackById(id)

  if (result.success) {
    selectedDetail.value = result.data
  } else {
    detailError.value = result.error
  }

  isFetchingDetail.value = false
}

// Update Status Review
const handleReview = async (id) => {
  isUpdating.value = true
  const result = await feedbackStore.markAsReviewed(id)

  if (result.success) {
    selectedDetail.value.is_reviewed = true
    alert('Status laporan berhasil diperbarui!')
    closeDetailModal()
  } else {
    alert(result.error)
  }

  isUpdating.value = false
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedDetail.value = null
  detailError.value = ''
}
</script>
