<template>
  <div class="min-h-screen pb-20 bg-[#fafcfc]">
    <header class="glass-effect border-b border-[#2c63d1]/10 sticky bg-[#fafcfc]/10 top-0 z-40 backdrop-blur-md shadow">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-[#2c63d1] flex items-center justify-center shadow-lg shadow-secondary/20">
            <Shield class="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 class="text-xl font-semibold text-black">SEQR</h1>
            <p class="text-xs text-black/60 font-mono">Deteksi Quishing</p>
          </div>
        </div>
        <button
        @click="handleLogout"
        class="p-2 hover:bg-black/10 rounded-lg transition-colors"
        title="Keluar"
        >
        <LogOut class="w-5 h-5 text-black/60 hover:text-secondary cursor-pointer" />
      </button>
    </div>
  </header>

  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="mb-8 fade-in">
      <h2 class="text-3xl font-bold text-black mb-2">
        Selamat Datang
      </h2>
      <p class="text-black/60">
        Pindai kode QR atau URL untuk mendeteksi ancaman phishing
      </p>
    </div>

    <div v-if="!scanResult" class="space-y-6 fade-in">
      <div class=" flex justify-center">
        <div class="glass-effect bg-[#2c63d1] rounded-xl p-2 inline-flex gap-2 ">
          <button
          v-for="method in scanMethods"
          :key="method.id"
          @click="activeScanMethod = method.id"
          :class="[
          'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 cursor-pointer',
          activeScanMethod === method.id
          ? 'bg-primary text-black shadow-lg shadow-secondary/30'
          : 'text-white/60 hover:text-white hover:bg-white/10'
          ]"
          >
          <component :is="method.icon" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ method.label }}</span>
          <span class="sm:hidden">{{ method.shortLabel }}</span>
        </button>
      </div>
    </div>

    <div class="glass-effect rounded-2xl p-8 mt-4 shadow-2xl">
      <div v-if="activeScanMethod === 'qr-scan'" class="text-center">
        <div class="w-64 h-64 mx-auto mb-6 bg-[#2c63d1]/50 rounded-xl flex items-center justify-center relative overflow-hidden">
          <QrCode class="w-24 h-24 text-black/20" />
          <div class="absolute inset-0 border-t-2 border-secondary animate-scan-line shadow-[0_0_15px_rgba(237,237,116,0.5)]"></div>
        </div>
        <h3 class="text-xl font-bold text-black mb-2">Posisikan Kode QR</h3>
        <p class="text-black/60 mb-6">Sejajarkan kode QR di dalam bingkai</p>
        <button
        @click="simulateScan('qr-scan', 'Data Kode QR')"
        :disabled="scanning"
        class="px-8 py-3 bg-[#2c63d1] hover:bg-opacity-90 text-primary font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-secondary/30"
        >
        <span v-if="!scanning">Pindai</span>
        <span v-else class="loading-dots">Memindai</span>
      </button>
    </div>

    <div v-else-if="activeScanMethod === 'qr-upload'" class="text-center">
      <label class="block cursor-pointer">
        <input
        type="file"
        accept="image/*"
        @change="handleFileUpload"
        class="hidden"
        />
        <div class="w-64 h-64 mx-auto mb-6 bg-[#2c63d1]/50 rounded-xl transition-colors flex flex-col items-center justify-center gap-4 group">
          <Upload class="w-16 h-16 text-white/40 group-hover:text-secondary transition-colors" />
          <div>
            <p class="text-white font-semibold">Klik untuk mengunggah</p>
            <p class="text-sm text-white/50">PNG, JPG maks 10MB</p>
          </div>
        </div>
      </label>
      <p class="text-[#F82828] mb-6">Unggah gambar yang berisi kode QR</p>
    </div>

    <div v-else-if="activeScanMethod === 'url-input'">
      <h3 class="text-xl font-bold text-black mb-4">Masukkan URL untuk Dipindai</h3>
      <form @submit.prevent="handleUrlScan" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-black/80 mb-2">
            URL Situs Web
          </label>
          <div class="relative">
            <Link2 class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black/40" />
            <input
            v-model="urlInput"
            type="url"
            required
            placeholder="https://contoh.com"
            class="w-full pl-11 pr-4 py-3 bg-[#2c63d1]/50 rounded-lg text-white placeholder-white/40"
            />
          </div>
        </div>
        <button
        type="submit"
        :disabled="scanning"
        class="w-full py-3 bg-secondary hover:bg-opacity-90 text-black mt-4 font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-secondary/30"
        >
        <Scan v-if="!scanning" class="w-5 h-5" />
        <span v-if="!scanning">Analisis URL</span>
        <span v-else class="loading-dots">Menganalisis</span>
      </button>
    </form>
  </div>
</div>
</div>

<div v-else class="space-y-6 fade-in">
  <div class="glass-effect rounded-2xl p-8 shadow-2xl">
    <div class="flex items-start justify-between mb-6">
      <h3 class="text-2xl font-bold text-black">Hasil Pemindaian</h3>
      <button
      @click="resetScan"
      class="text-black/60 hover:text-secondary transition-colors cursor-pointer"
      >
      <X class="w-6 h-6" />
    </button>
  </div>

  <div class="mb-8">
    <div class="flex items-end gap-4 mb-3">
      <div class="text-6xl font-bold text-black">
        {{ scanResult.score }}%
      </div>
      <div class="pb-2">
        <span
        :class="[
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm',
        scanResult.status === 'Phishing'
        ? 'bg-red-500/20 text-red-300 border border-red-500/50'
        : 'bg-green-500/20 text-green-300 border border-green-500/50'
        ]"
        >
        <component
        :is="scanResult.status === 'Phishing' ? AlertTriangle : Shield"
        class="w-4 h-4"
        />
        {{ scanResult.status === 'Phishing' ? 'Phishing' : 'Aman' }}
      </span>
    </div>
  </div>

  <div class="relative h-3 bg-primary rounded-full overflow-hidden border border-white/10">
    <div
    :class="[
    'h-full transition-all duration-1000 rounded-full',
    scanResult.score > 50
    ? 'bg-red-500'
    : 'bg-green-500'
    ]"
    :style="{ width: scanResult.score + '%' }"
    ></div>
  </div>
</div>

<div class="bg-[#2c63d1]/50 rounded-lg p-6 border border-white/10">
  <h4 class="font-semibold text-white mb-3 flex items-center gap-2">
    <Info class="w-5 h-5 text-secondary" />
    Detail Analisis
  </h4>
  <p class="text-white/80 leading-relaxed">
    {{ scanResult.reason }}
  </p>
</div>

<div class="mt-4 bg-primary rounded-lg p-4 border border-white/10">
  <p class="text-xs text-black/50 mb-1 font-mono">URL DIPINDAI</p>
  <p class="text-sm text-black/80 font-mono break-all">{{ scanResult.url }}</p>
</div>
</div>

<div class="glass-effect rounded-2xl p-8 shadow-2xl bg-white/5 border border-white/10 mt-4">
  <h3 class="text-xl font-bold text-black mb-4 flex items-center gap-2">
    <MessageSquare class="w-6 h-6 text-secondary" />
    Laporkan Kesalahan Deteksi
  </h3>
  <p class="text-black/60 mb-6 text-sm">
    Bantu kami meningkatkan akurasi deteksi dengan melaporkan hasil yang tidak sesuai
  </p>

  <form @submit.prevent="submitFeedback" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-black/80 mb-2">
        Deskripsi (Keterangan)
      </label>
      <textarea
      v-model="feedback.keterangan"
      required
      rows="4"
      class="w-full px-4 py-3 bg-[#2c63d1]/50 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent resize-none"
      placeholder="Jelaskan mengapa menurut Anda deteksi ini keliru..."
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-black/80 mb-2">
        Status yang Benar
      </label>
      <select
      v-model="feedback.proposedStatus"
      required
      class="w-full px-4 py-3 bg-[#2c63d1]/50 border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent text-black"
      >
      <option value="" class="bg-primary">Pilih status yang benar</option>
      <option value="Legitimate" class="bg-primary">Aman (Legitimate)</option>
      <option value="Phishing" class="bg-primary">Phishing</option>
    </select>
  </div>

  <button
  type="submit"
  :disabled="submittingFeedback"
  class="w-full py-3 bg-black/10 hover:bg-black/20 text-black font-semibold rounded-lg transition-all disabled:opacity-50 mt-2 disabled:cursor-not-allowed flex items-center justify-center gap-2 border border-black/10"
  >
  <Send v-if="!submittingFeedback" class="w-5 h-5" />
  <span v-if="!submittingFeedback">Kirim Laporan</span>
  <span v-else class="loading-dots">Mengirim</span>
</button>
</form>

<div v-if="feedbackSuccess" class="mt-4 bg-green-500/10 border border-green-500/50 rounded-lg p-3 flex items-start gap-3">
  <CheckCircle class="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
  <p class="text-sm text-green-300">Terima kasih! Laporan Anda berhasil dikirim.</p>
</div>
</div>
</div>
</div>
</div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useScannerStore } from '@/stores/scanner'
import {
  Shield, QrCode, Upload, Link2, Scan, LogOut, X, Info,
  AlertTriangle, MessageSquare, Send, CheckCircle
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const scannerStore = useScannerStore()

const scanMethods = [
{ id: 'qr-scan', label: 'Pindai QR', shortLabel: 'Pindai', icon: QrCode },
{ id: 'qr-upload', label: 'Unggah QR', shortLabel: 'Unggah', icon: Upload },
{ id: 'url-input', label: 'Input URL', shortLabel: 'URL', icon: Link2 }
]

const activeScanMethod = ref('qr-scan')
const scanning = ref(false)
const urlInput = ref('')
const scanResult = ref(null)
const submittingFeedback = ref(false)
const feedbackSuccess = ref(false)

const feedback = reactive({
  keterangan: '',
  proposedStatus: ''
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const simulateScan = async (type, data) => {
  scanning.value = true
  const result = await scannerStore.performScan({
    type,
    data,
    url: 'https://contoh-' + Math.random().toString(36).substring(7) + '.com',
    userId: authStore.user?.id || null
  })
  scanResult.value = result
  scanning.value = false
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (file) {
    scanning.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    await simulateScan('qr-upload', file.name)
  }
}

const handleUrlScan = async () => {
  if (!urlInput.value) return
    scanning.value = true
  const result = await scannerStore.performScan({
    type: 'url-input',
    url: urlInput.value,
    userId: authStore.user?.id
  })
  scanResult.value = result
  scanning.value = false
}

const resetScan = () => {
  scanResult.value = null
  urlInput.value = ''
  feedback.keterangan = ''
  feedback.proposedStatus = ''
  feedbackSuccess.value = false
}

const submitFeedback = async () => {
  submittingFeedback.value = true
  await scannerStore.submitFeedback(scanResult.value.id, feedback)
  submittingFeedback.value = false
  feedbackSuccess.value = true

  setTimeout(() => {
    feedbackSuccess.value = false
  }, 5000)
}
</script>
