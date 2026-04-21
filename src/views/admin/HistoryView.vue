<template>
  <div class="min-h-screen pb-8">
    <Header />
    <Navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">

      <WelcomeMessage title="Riwayat Pemindaian" message="Lihat semua pemindaian yang telah dilakukan dan hasilnya." />

      <div v-if="historyStore.isLoading" class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="w-12 h-12 border-4 border-[#2c63d1] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-black/60 font-mono">Memuat data dari server SEQR...</p>
      </div>

      <div v-else>
        <div v-if="historyStore.error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong class="font-bold">Error! </strong>
          <span class="block sm:inline">{{ historyStore.error }}</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
          <div class="glass-effect rounded-xl p-6 bg-[#2c63d1]/5 border border-black/10">
            <div class="text-3xl font-bold text-black mb-1">
              {{ historyStore.histories.length }}
            </div>
            <div class="text-sm text-black/60">Total Pemindaian</div>
          </div>
          <div class="glass-effect rounded-xl p-6 bg-[#2c63d1]/5 border border-black/10">
            <div class="text-3xl font-bold text-black mb-1">
              {{ phishingCount }}
            </div>
            <div class="text-sm text-black/60">Phishing Terdeteksi</div>
          </div>
          <div class="glass-effect rounded-xl p-6 bg-[#2c63d1]/5 border border-black/10">
            <div class="text-3xl font-bold text-black mb-1">
              {{ legitimateCount }}
            </div>
            <div class="text-sm text-black/60">Aman (Legitimate)</div>
          </div>
          <div class="glass-effect rounded-xl p-6 bg-[#2c63d1]/5 border border-black/10">
            <div class="text-3xl font-bold text-black mb-1">
              {{ averageScore }}%
            </div>
            <div class="text-sm text-black/60">Rata-rata Skor Ancaman</div>
          </div>
        </div>

        <div class="flex justify-end my-2">
          <button
          @click="downloadReport"
          :disabled="isDownloading"
          class="p-3 bg-red-800 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg"
          >
          <span v-if="!isDownloading">Download Report</span>
          <span v-else class="flex items-center gap-2">
            <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Downloading...
          </span>
        </button>
      </div>

      <div class="glass-effect rounded-2xl shadow-2xl overflow-hidden fade-in bg-[#2c63d1]/20 border border-black/10">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#2c63d1]/50 border-b border-black/10">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">ID</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">URL</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Skor</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Waktu</th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/10">
              <tr
              v-for="scan in historyStore.histories"
              :key="scan.id"
              class="hover:bg-[#2c63d1]/5 transition-colors"
              >
              <td class="px-6 py-4">
                <code class="text-sm font-mono text-[#231abe]">{{ scan.id }}</code>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-black max-w-xs truncate font-mono">
                  {{ scan.url }}
                </p>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-16 h-2 bg-[#1e2530] rounded-full overflow-hidden border border-black/10">
                    <div
                    :class="[
                    'h-full',
                    formatScore(scan.phishing_prob) > 50 ? 'bg-[#ef4444]' : 'bg-[#22c55e]'
                    ]"
                    :style="{ width: formatScore(scan.phishing_prob) + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-mono text-black">{{ formatScore(scan.phishing_prob) }}%</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                :class="[
                'inline-flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-xs border',
                scan.status === 'phishing'
                ? 'bg-[#ef4444]/20 text-[#f87171] border-[#ef4444]/50'
                : 'bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/50'
                ]"
                >
                <component :is="scan.status === 'phishing' ? AlertTriangle : ShieldCheck" class="w-3 h-3" />
                {{ scan.status === 'phishing' ? 'Phishing' : 'Aman' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-black/60 whitespace-nowrap">
              {{ formatDate(scan.timestamp || scan.created_at) }}
            </td>
            <td class="px-6 py-4 text-center">
              <button
              @click="openDetailModal(scan.id)"
              class="px-3 py-1 bg-[#2c63d1]/10 hover:bg-[#2c63d1]/20 text-[#2c63d1] rounded-lg text-sm font-semibold transition-colors"
              >
              Detail
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-if="historyStore.histories.length === 0 && !historyStore.error" class="text-center py-16">
    <History class="w-16 h-16 text-black/40 mx-auto mb-4" />
    <h3 class="text-xl font-semibold text-black mb-2">Tidak Ada Riwayat Pemindaian</h3>
    <p class="text-black/60">Data pemindaian akan muncul di sini</p>
  </div>
</div>
</div>
</div>
</div>


<div
v-if="showDetailModal"
class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in"
@click.self="closeDetailModal"
>
<div class="glass-effect rounded-2xl p-8 max-w-2xl w-full shadow-2xl bg-white border border-black/10">
  <div class="flex justify-between items-center mb-6 border-b pb-4">
    <h3 class="text-2xl font-bold text-black">Detail Pemindaian</h3>
    <button @click="closeDetailModal" class="text-black/50 hover:text-red-500 font-bold text-xl">&times;</button>
  </div>

  <div v-if="isFetchingDetail" class="flex justify-center py-10">
    <div class="w-10 h-10 border-4 border-[#2c63d1] border-t-transparent rounded-full animate-spin"></div>
  </div>

  <div v-else-if="detailError" class="text-red-500 bg-red-100 p-4 rounded-lg">
    {{ detailError }}
  </div>

  <div v-else-if="selectedDetail" class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-black/5 p-4 rounded-lg">
        <p class="text-xs text-black/50 mb-1">ID Riwayat</p>
        <p class="font-mono text-[#2c63d1] font-semibold">#{{ selectedDetail.id }}</p>
      </div>
      <div class="bg-black/5 p-4 rounded-lg">
        <p class="text-xs text-black/50 mb-1">Status AI</p>
        <span :class="[
        'px-2 py-1 rounded text-xs font-bold',
        selectedDetail.status === 'phishing' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
        ]">
        {{ selectedDetail.status.toUpperCase() }}
      </span>
    </div>
  </div>

  <div class="grid grid-cols-2 gap-4 my-3">
    <div class="bg-black/5 p-4 rounded-lg">
      <p class="text-xs text-black/50 mb-1">Skor Ancaman</p>
      <p class="font-bold text-black/80">{{ Math.round(selectedDetail.phishing_prob * 100) }}%</p>
    </div>
    <div class="bg-black/5 p-4 rounded-lg">
      <p class="text-xs text-black/50 mb-1">Waktu Pemindaian</p>
      <p class="text-sm text-black/80">{{ new Date(selectedDetail.created_at).toLocaleString('id-ID') }}</p>
    </div>
  </div>

  <div class="bg-black/5 p-4 rounded-lg">
    <p class="text-xs text-black/50 mb-1">Target URL</p>
    <p class="font-mono text-sm break-all text-[#2c63d1]">{{ selectedDetail.url }}</p>
  </div>
</div>

<div class="mt-8 flex justify-end">
  <button @click="closeDetailModal" class="px-6 py-2 bg-black/10 hover:bg-black/20 text-black font-semibold rounded-lg transition-colors">
    Tutup
  </button>
</div>
</div>
</div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useHistoryStore } from '@/stores/admin/history'
import api from '@/utils/axios'

import {
  Shield, LogOut, LayoutDashboard, Brain, MessageSquare, History,
  AlertTriangle, ShieldCheck, QrCode, Upload, Link2
} from 'lucide-vue-next'

import { Header, Navbar, WelcomeMessage } from './components'

const isDownloading = ref(false)

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const historyStore = useHistoryStore()

const showDetailModal = ref(false)
const isFetchingDetail = ref(false)
const selectedDetail = ref(null)
const detailError = ref('')

onMounted(async () => {
  await historyStore.fetchAdminHistory()
})

const downloadReport = async () => {
  isDownloading.value = true

  try {
    const response = await api.get('/admin/report', {
      responseType: 'blob'
    })

    const blob = new Blob([response.data])
    const url = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url

    const fileName = `SEQR_Report_${new Date().toISOString().split('T')[0]}.pdf`
    link.setAttribute('download', fileName)

    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)

  } catch (error) {
    console.error('Gagal mengunduh laporan:', error)
    alert('Terjadi kesalahan saat mengunduh laporan.')
  } finally {
    isDownloading.value = false
  }
}

// Fungsi untuk membuka modal dan memanggil API get_by_id
const openDetailModal = async (id) => {
  showDetailModal.value = true
  isFetchingDetail.value = true
  selectedDetail.value = null
  detailError.value = ''

  const result = await historyStore.fetchHistoryById(id)

  if (result.success) {
    selectedDetail.value = result.data
  } else {
    detailError.value = result.error
  }

  isFetchingDetail.value = false
}

// Fungsi untuk menutup modal
const closeDetailModal = () => {
  showDetailModal.value = false
  selectedDetail.value = null
  detailError.value = ''
}



const phishingCount = computed(() =>
  historyStore.histories.filter(s => s.status === 'phishing').length
  )

const legitimateCount = computed(() =>
  historyStore.histories.filter(s => s.status === 'legitimate').length
  )

const averageScore = computed(() => {
  if (historyStore.histories.length === 0) return 0

    const sum = historyStore.histories.reduce((acc, scan) => {
      const percentage = (scan.phishing_prob || 0) * 100
      return acc + percentage
    }, 0)

  return Math.round(sum / historyStore.histories.length)
})

const navClass = (path) => {
  return [
  'px-4 py-3 font-medium transition-all whitespace-nowrap',
  route.path === path
  ? 'text-[#eded74] border-b-2 border-[#eded74]'
  : 'text-black/60 hover:text-black'
]
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

const formatScore = (score) => {
  if (score === undefined || score === null) return 0
    return Math.round(score * 100)
}

</script>
