<template>
  <div class="min-h-screen pb-8">
    <Header />
    <Navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">

      <WelcomeMessage title="Riwayat Pemindaian" message="Lihat semua pemindaian yang telah dilakukan dan hasilnya." />


      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
        <div class="glass-effect rounded-xl p-6 bg-[#2c63d1]/5 border border-black/10">
          <div class="text-3xl font-bold text-black mb-1">
            {{ scannerStore.scanHistory.length }}
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

      <div class="glass-effect rounded-2xl shadow-2xl overflow-hidden fade-in bg-[#2c63d1]/20 border border-black/10">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-[#2c63d1]/50 border-b border-black/10">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  ID Pemindaian
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  URL
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Tipe
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Skor
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">
                  Waktu
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-black/10">
              <tr
              v-for="scan in scannerStore.scanHistory"
              :key="scan.id"
              class="hover:bg-[#2c63d1]/5 transition-colors"
              >
              <td class="px-6 py-4">
                <code class="text-sm font-mono text-[#eded74]">
                  #{{ scan.id }}
                </code>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-black max-w-xs truncate font-mono">
                  {{ scan.url }}
                </p>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-xs bg-black/10 text-black/80 border border-white/5">
                  <component :is="getScanTypeIcon(scan.type)" class="w-3 h-3" />
                  {{ formatScanType(scan.type) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="w-16 h-2 bg-[#1e2530] rounded-full overflow-hidden border border-black/10">
                    <div
                    :class="[
                    'h-full',
                    scan.score > 50 ? 'bg-[#ef4444]' : 'bg-[#22c55e]'
                    ]"
                    :style="{ width: scan.score + '%' }"
                    ></div>
                  </div>
                  <span class="text-sm font-mono text-black">{{ scan.score }}%</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                :class="[
                'inline-flex items-center gap-2 px-3 py-1 rounded-lg font-semibold text-xs border',
                scan.status === 'Phishing'
                ? 'bg-[#ef4444]/20 text-[#f87171] border-[#ef4444]/50'
                : 'bg-[#22c55e]/20 text-[#4ade80] border-[#22c55e]/50'
                ]"
                >
                <component :is="scan.status === 'Phishing' ? AlertTriangle : ShieldCheck" class="w-3 h-3" />
                {{ scan.status === 'Phishing' ? 'Phishing' : 'Aman' }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-black/60 whitespace-nowrap">
              {{ formatDate(scan.timestamp) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="scannerStore.scanHistory.length === 0" class="text-center py-16">
      <History class="w-16 h-16 text-black/40 mx-auto mb-4" />
      <h3 class="text-xl font-semibold text-black mb-2">Tidak Ada Riwayat Pemindaian</h3>
      <p class="text-black/60">Data pemindaian akan muncul di sini</p>
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
  Shield, LogOut, LayoutDashboard, Brain, MessageSquare, History,
  AlertTriangle, ShieldCheck, QrCode, Upload, Link2
} from 'lucide-vue-next'

import {Header, Navbar, WelcomeMessage } from './components'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const scannerStore = useScannerStore()

const phishingCount = computed(() =>
  scannerStore.scanHistory.filter(s => s.status === 'Phishing').length
  )

const legitimateCount = computed(() =>
  scannerStore.scanHistory.filter(s => s.status === 'Legitimate').length
  )

const averageScore = computed(() => {
  if (scannerStore.scanHistory.length === 0) return 0
    const sum = scannerStore.scanHistory.reduce((acc, scan) => acc + scan.score, 0)
  return Math.round(sum / scannerStore.scanHistory.length)
})

const navClass = (path) => {
  return [
  'px-4 py-3 font-medium transition-all whitespace-nowrap',
  route.path === path
  ? 'text-[#eded74] border-b-2 border-[#eded74]'
  : 'text-black/60 hover:text-black'
]
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Format waktu disesuaikan ke format Indonesia (id-ID)
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getScanTypeIcon = (type) => {
  const icons = {
    'qr-scan': QrCode,
    'qr-upload': Upload,
    'url-input': Link2
  }
  return icons[type] || QrCode
}

const formatScanType = (type) => {
  const types = {
    'qr-scan': 'Pindai QR',
    'qr-upload': 'Unggah QR',
    'url-input': 'Input URL'
  }
  return types[type] || type
}
</script>
