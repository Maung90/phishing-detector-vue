<template>
  <div class="min-h-screen font-sans" style="background-color:#f4f7ff; background-image: radial-gradient(ellipse at 20% 0%, #dce8ff 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, #e0e9ff 0%, transparent 50%);">

    <!-- ── HEADER ─────────────────────────────────────────── -->
    <header class="sticky top-0 z-50 border-b backdrop-blur-md" style="background:rgba(244,247,255,0.88); border-color:rgba(44,99,209,0.1);">
      <div class="max-w-2xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center" style="background:#2c63d1; box-shadow:0 4px 14px rgba(44,99,209,0.35);">
            <Shield class="w-5 h-5 text-white" />
          </div>
          <div class="flex flex-col">
            <span class="text-base font-extrabold tracking-tight" style="color:#0f1b3d;">SEQR</span>
            <span class="text-xs font-mono" style="color:#6b7fa3;">Deteksi Quishing</span>
          </div>
        </div>
        <button @click="handleLogout"
          class="flex items-center gap-2 px-3.5 py-2 rounded-lg border text-sm font-medium transition-colors cursor-pointer"
          style="color:#6b7fa3; border-color:rgba(44,99,209,0.15);"
          @mouseenter="e => e.currentTarget.style.color='#2c63d1'"
          @mouseleave="e => e.currentTarget.style.color='#6b7fa3'">
          <DoorOpen class="w-4 h-4" />
          <span>Daftar</span>
        </button>
      </div>
    </header>

    <main class="max-w-2xl mx-auto px-5 py-8 pb-24">

      <!-- ── HERO ──────────────────────────────────────────── -->
      <section v-if="!scanResult" class="mb-7 anim-fade-up">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4"
          style="background:rgba(44,99,209,0.07); border-color:rgba(44,99,209,0.18); color:#2c63d1;">
          <span class="w-2 h-2 rounded-full anim-pulse" style="background:#2c63d1;"></span>
          Sistem Aktif
        </div>
        <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2.5" style="color:#0f1b3d;">
          Deteksi Ancaman<br /><em class="not-italic" style="color:#2c63d1;">Quishing</em> Sekarang
        </h2>
        <p class="text-sm leading-relaxed" style="color:#6b7fa3;">
          Pindai kode QR atau masukkan URL untuk menganalisis potensi phishing secara instan.
        </p>
      </section>

      <!-- ── RESULT NAV ─────────────────────────────────────── -->
      <div v-if="scanResult" class="flex items-center gap-3 mb-5 anim-fade-up">
        <button @click="resetScan"
          class="flex items-center gap-2 px-3.5 py-2 rounded-lg border bg-white text-sm font-semibold transition-all"
          style="color:#2c63d1; border-color:rgba(44,99,209,0.2);">
          <X class="w-4 h-4" /> Pindai Ulang
        </button>
        <span class="text-sm font-medium" style="color:#9baac5;">Hasil Analisis</span>
      </div>

      <!-- ── SCANNER CARD ────────────────────────────────────── -->
      <div v-if="!scanResult" class="rounded-2xl overflow-hidden border anim-fade-up"
        style="background:#ffffff; border-color:rgba(44,99,209,0.1); box-shadow:0 4px 40px rgba(44,99,209,0.08);">

        <!-- Tab Bar -->
        <div class="flex gap-1 px-3 pt-3 border-b" style="border-color:rgba(44,99,209,0.08);">
          <button
            v-for="method in scanMethods" :key="method.id"
            @click="activeScanMethod = method.id"
            :class="['flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-sm font-semibold transition-all border border-b-0 relative bottom-px',
              activeScanMethod === method.id ? 'tab-active' : 'tab-inactive']">
            <component :is="method.icon" class="w-4 h-4" />
            <span class="hidden sm:inline">{{ method.label }}</span>
            <span class="sm:hidden">{{ method.shortLabel }}</span>
          </button>
        </div>

        <!-- Panel Body -->
        <div class="p-6 sm:p-8" style="background:#f4f7ff;">

          <!-- Kamera QR -->
          <div v-if="activeScanMethod === 'qr-scan'" class="flex flex-col items-center">
            <div class="relative w-64 h-64 rounded-2xl overflow-hidden mb-4" style="background:#0f1b3d;">
              <div id="qr-reader" class="w-full h-full"></div>

              <!-- Overlay: sedang submit ke backend setelah QR terbaca -->
              <div v-if="scanning" class="absolute inset-0 flex flex-col items-center justify-center gap-3 z-20"
                style="background:rgba(15,27,61,0.82);">
                <div class="spinner"></div>
                <span class="text-xs font-semibold text-white">Menganalisis URL...</span>
              </div>

              <!-- Overlay: QR terdeteksi kamera (flash hijau) -->
              <Transition name="qr-found">
                <div v-if="cameraQrDetected" class="absolute inset-0 flex flex-col items-center justify-center gap-2 z-20 qr-found-overlay">
                  <div class="w-14 h-14 rounded-full flex items-center justify-center" style="background:rgba(22,163,74,0.95);">
                    <CheckCircle class="w-8 h-8 text-white" />
                  </div>
                  <span class="text-xs font-bold text-white">QR Terdeteksi!</span>
                </div>
              </Transition>

              <!-- Corner guides — berubah warna hijau saat terdeteksi -->
              <span class="qr-corner top-2.5 left-2.5 border-t-2 border-l-2 rounded-tl" :class="cameraQrDetected ? 'corner-found' : ''"></span>
              <span class="qr-corner top-2.5 right-2.5 border-t-2 border-r-2 rounded-tr" :class="cameraQrDetected ? 'corner-found' : ''"></span>
              <span class="qr-corner bottom-2.5 left-2.5 border-b-2 border-l-2 rounded-bl" :class="cameraQrDetected ? 'corner-found' : ''"></span>
              <span class="qr-corner bottom-2.5 right-2.5 border-b-2 border-r-2 rounded-br" :class="cameraQrDetected ? 'corner-found' : ''"></span>
            </div>

            <!-- Status indicator kamera -->
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2 h-2 rounded-full" :class="scanning ? 'bg-yellow-400' : 'bg-green-400 anim-pulse'"></span>
              <span class="text-xs font-semibold" style="color:#6b7fa3;">
                {{ scanning ? 'Menganalisis...' : 'Kamera aktif · mencari QR' }}
              </span>
            </div>

            <p class="text-base font-bold mb-1" style="color:#0f1b3d;">Arahkan Kamera ke Kode QR</p>
            <p class="text-sm text-center" style="color:#6b7fa3;">Pastikan kode QR di dalam bingkai dan pencahayaan cukup</p>
          </div>

          <!-- Upload QR -->
          <div v-else-if="activeScanMethod === 'qr-upload'" class="flex flex-col items-center">

            <!-- State A: Belum ada gambar → zona upload -->
            <label v-if="!uploadPreviewUrl" class="w-full" :class="scanning ? 'pointer-events-none opacity-60 cursor-not-allowed' : 'cursor-pointer'">
              <input type="file" accept="image/*" @change="handleFileUpload" ref="fileInputRef" class="hidden" :disabled="scanning" />
              <div class="flex flex-col items-center justify-center gap-4 w-full rounded-2xl border-2 border-dashed transition-all upload-zone"
                style="background:#ffffff; border-color:rgba(44,99,209,0.25); min-height:210px; padding:32px 20px;">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center" style="background:rgba(44,99,209,0.08);">
                  <Upload class="w-7 h-7" style="color:#2c63d1;" />
                </div>
                <div class="text-center">
                  <p class="text-sm font-bold mb-1" style="color:#0f1b3d;">Klik atau seret gambar ke sini</p>
                  <p class="text-xs" style="color:#9baac5;">Mendukung PNG, JPG, JPEG · Maks 10MB</p>
                </div>
              </div>
            </label>

            <!-- State B: Gambar sudah dipilih → preview + scanning overlay -->
            <div v-else class="w-full flex flex-col items-center gap-4">
              <div class="relative w-full rounded-2xl overflow-hidden border-2"
                style="border-color:rgba(44,99,209,0.2); background:#0f1b3d; max-height:300px;">

                <!-- Gambar preview -->
                <img :src="uploadPreviewUrl" alt="Preview QR"
                  class="w-full object-contain block" style="max-height:300px;" />

                <!-- Overlay scanning saat proses -->
                <div v-if="scanning" class="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style="background:rgba(15,27,61,0.72); backdrop-filter:blur(2px);">
                  <!-- Scan line sweep -->
                  <div class="scan-line-wrap">
                    <div class="scan-line"></div>
                  </div>
                  <div class="flex items-center gap-2.5 px-4 py-2 rounded-full" style="background:rgba(44,99,209,0.9);">
                    <div class="spinner spinner-sm"></div>
                    <span class="text-xs font-bold text-white">Membaca kode QR...</span>
                  </div>
                </div>

                <!-- Badge sukses saat tidak scanning (gambar sudah dipilih, belum scan) -->
                <div v-if="!scanning" class="absolute top-3 right-3">
                  <span class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                    style="background:rgba(44,99,209,0.9); color:#ffffff;">
                    <CheckCircle class="w-3 h-3" /> Gambar dipilih
                  </span>
                </div>
              </div>

              <!-- Tombol ganti gambar -->
              <label class="cursor-pointer">
                <input type="file" accept="image/*" @change="handleFileUpload" ref="fileInputRef2" class="hidden" :disabled="scanning" />
                <span class="flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all"
                  style="color:#2c63d1; border-color:rgba(44,99,209,0.25); background:#ffffff;">
                  <Upload class="w-3.5 h-3.5" /> Ganti Gambar
                </span>
              </label>
            </div>

            <p class="text-xs text-center mt-3" style="color:#6b7fa3;">Unggah gambar yang berisi kode QR untuk dianalisis</p>
          </div>

          <!-- Input URL -->
          <div v-else-if="activeScanMethod === 'url-input'">
            <div class="flex flex-col items-center mb-6">
              <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style="background:rgba(44,99,209,0.08);">
                <Link2 class="w-7 h-7" style="color:#2c63d1;" />
              </div>
              <p class="text-base font-bold mb-1" style="color:#0f1b3d;">Analisis URL Secara Langsung</p>
              <p class="text-sm text-center" style="color:#6b7fa3;">Masukkan alamat website yang ingin Anda verifikasi keamanannya</p>
            </div>
            <form @submit.prevent="handleUrlScan" class="flex flex-col gap-3">
              <div class="relative">
                <Link2 class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color:#9baac5;" />
                <input
                  v-model="urlInput" type="url" required placeholder="https://contoh.com"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style="background:#ffffff; color:#0f1b3d; border-color:rgba(44,99,209,0.2); font-family:inherit;"
                  @focus="e => { e.target.style.borderColor='#2c63d1'; e.target.style.boxShadow='0 0 0 3px rgba(44,99,209,0.1)'; }"
                  @blur="e => { e.target.style.borderColor='rgba(44,99,209,0.2)'; e.target.style.boxShadow='none'; }" />
              </div>
              <button type="submit" :disabled="scanning"
                class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                style="background:#2c63d1;">
                <Scan v-if="!scanning" class="w-4 h-4" />
                <div v-else class="spinner spinner-sm"></div>
                <span>{{ scanning ? 'Menganalisis...' : 'Analisis URL' }}</span>
              </button>
            </form>
          </div>

        </div>
      </div>

      <!-- ── RESULT SECTION ──────────────────────────────────── -->
      <div v-if="scanResult" class="flex flex-col gap-4 anim-fade-up">

        <!-- Score Card -->
        <div class="rounded-2xl p-6 sm:p-7 border" :class="isPhishing ? 'result-danger' : 'result-safe'">
          <div class="mb-5">
            <span class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border"
              :class="isPhishing ? 'badge-danger' : 'badge-safe'">
              <component :is="isPhishing ? AlertTriangle : Shield" class="w-3.5 h-3.5" />
              {{ isPhishing ? 'Terdeteksi Phishing' : 'URL Aman' }}
            </span>
          </div>

          <div class="font-extrabold tracking-tight leading-none mb-1"
            :class="isPhishing ? 'score-red' : 'score-green'" style="font-size:72px;">
            {{ formatScore(scanResult.score) }}<span style="font-size:36px;">%</span>
          </div>
          <p class="text-xs font-medium mb-5" style="color:#6b7fa3;">Probabilitas Phishing</p>

          <div class="mb-5">
            <div class="h-2 rounded-full overflow-hidden mb-1.5" style="background:rgba(0,0,0,0.08);">
              <div class="h-full rounded-full bar-transition"
                :class="isPhishing ? 'bar-danger' : 'bar-safe'"
                :style="{ width: formatScore(scanResult.score) + '%' }"></div>
            </div>
            <div class="flex justify-between text-xs font-medium" style="color:#9baac5;">
              <span>Aman</span><span>Bahaya</span>
            </div>
          </div>

          <div class="flex flex-col gap-1 rounded-xl p-3.5 border"
            style="background:rgba(0,0,0,0.04); border-color:rgba(0,0,0,0.06);">
            <span class="text-xs font-bold tracking-widest font-mono uppercase" style="color:#9baac5;">URL Dipindai</span>
            <span class="text-xs font-mono break-all" style="color:#2c63d1;">{{ scanResult.url }}</span>
          </div>
        </div>

        <!-- Detection Factors -->
        <div class="rounded-2xl p-5 sm:p-6 bg-white border"
          style="border-color:rgba(44,99,209,0.1); box-shadow:0 2px 16px rgba(44,99,209,0.06);">
          <h4 class="flex items-center gap-2 text-sm font-bold mb-4" style="color:#0f1b3d;">
            <Info class="w-4 h-4" style="color:#2c63d1;" /> Faktor Deteksi Teratas
          </h4>
          <div v-if="scanResult.top_reasons && Object.keys(scanResult.top_reasons).length > 0" class="flex flex-col gap-2">
            <div v-for="(value, key) in scanResult.top_reasons" :key="key"
              class="flex items-start justify-between gap-3 px-3.5 py-2.5 rounded-lg border"
              style="background:#f4f7ff; border-color:rgba(44,99,209,0.08);">
              <span class="text-xs font-mono font-medium" style="color:#2c63d1;">{{ key }}</span>
              <span class="text-xs text-right shrink-0" style="color:#6b7fa3;">{{ value }}</span>
            </div>
          </div>
          <p v-else class="text-xs italic" style="color:#9baac5;">Tidak ada fitur spesifik yang terdeteksi menonjol.</p>
        </div>

        <!-- Feedback Card -->
        <div class="rounded-2xl p-5 sm:p-6 bg-white border"
          style="border-color:rgba(44,99,209,0.1); box-shadow:0 2px 16px rgba(44,99,209,0.06);">
          <div class="flex items-start gap-3 pb-4 mb-5 border-b" style="border-color:rgba(44,99,209,0.08);">
            <MessageSquare class="w-5 h-5 mt-0.5 shrink-0" style="color:#2c63d1;" />
            <div>
              <h3 class="text-sm font-bold mb-0.5" style="color:#0f1b3d;">Laporkan Kesalahan Deteksi</h3>
              <p class="text-xs" style="color:#6b7fa3;">Bantu kami meningkatkan akurasi sistem deteksi.</p>
            </div>
          </div>
          <form @submit.prevent="submitFeedbackForm" class="flex flex-col gap-3.5">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold" style="color:#4a5878;">Status yang Benar</label>
              <select v-model="feedback.proposedStatus" required
                class="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style="background:#f4f7ff; color:#0f1b3d; border-color:rgba(44,99,209,0.18); font-family:inherit;"
                @focus="e => { e.target.style.borderColor='#2c63d1'; e.target.style.boxShadow='0 0 0 3px rgba(44,99,209,0.1)'; }"
                @blur="e => { e.target.style.borderColor='rgba(44,99,209,0.18)'; e.target.style.boxShadow='none'; }">
                <option value="">Pilih status yang benar</option>
                <option value="legitimate">✅ Aman (Legitimate)</option>
                <option value="phishing">🚨 Phishing</option>
              </select>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold" style="color:#4a5878;">Keterangan Tambahan</label>
              <textarea v-model="feedback.keterangan" required rows="3"
                placeholder="Misal: Ini adalah web internal kampus saya..."
                class="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-all resize-none leading-relaxed"
                style="background:#f4f7ff; color:#0f1b3d; border-color:rgba(44,99,209,0.18); font-family:inherit;"
                @focus="e => { e.target.style.borderColor='#2c63d1'; e.target.style.boxShadow='0 0 0 3px rgba(44,99,209,0.1)'; }"
                @blur="e => { e.target.style.borderColor='rgba(44,99,209,0.18)'; e.target.style.boxShadow='none'; }">
              </textarea>
            </div>
            <button type="submit" :disabled="submittingFeedback"
              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
              style="background:#2c63d1;">
              <Send v-if="!submittingFeedback" class="w-4 h-4" />
              <div v-else class="spinner spinner-sm"></div>
              <span>{{ submittingFeedback ? 'Mengirim...' : 'Kirim Laporan' }}</span>
            </button>
          </form>
          <div v-if="feedbackSuccess" class="flex items-center gap-2.5 mt-4 px-4 py-3 rounded-xl border"
            style="background:#f0fdf4; border-color:rgba(34,197,94,0.25);">
            <CheckCircle class="w-4 h-4 shrink-0" style="color:#16a34a;" />
            <span class="text-xs font-semibold" style="color:#15803d;">Terima kasih! Laporan Anda berhasil dikirim.</span>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useScannerStore } from '@/stores/scanner'
import { Html5Qrcode } from 'html5-qrcode'

import {
  Shield, QrCode, Upload, Link2, Scan, DoorOpen, X, Info,
  AlertTriangle, MessageSquare, Send, CheckCircle
} from 'lucide-vue-next'

const router       = useRouter()
const authStore    = useAuthStore()
const scannerStore = useScannerStore()

const scanMethods = [
  { id: 'qr-scan',   label: 'Pindai Kamera', shortLabel: 'Kamera', icon: QrCode  },
  { id: 'qr-upload', label: 'Unggah Gambar',  shortLabel: 'Unggah', icon: Upload  },
  { id: 'url-input', label: 'Input URL',       shortLabel: 'URL',    icon: Link2  }
]

const activeScanMethod   = ref('qr-scan')
const scanning           = ref(false)
const urlInput           = ref('')
const scanResult         = ref(null)
const submittingFeedback = ref(false)
const feedbackSuccess    = ref(false)
const fileInputRef       = ref(null)
const fileInputRef2      = ref(null)
const uploadPreviewUrl   = ref(null)   // object URL gambar yang diupload
const cameraQrDetected   = ref(false)  // flash hijau saat kamera baca QR
const feedback = reactive({ keterangan: '', proposedStatus: '' })

const isPhishing  = computed(() => scanResult.value?.status === 'phishing')
const formatScore = (score) => Math.round((score || 0) * 100)

// ── KAMERA ────────────────────────────────────────────────────────────────────
let html5QrCode = null

const startCamera = async () => {
  if (html5QrCode) return
  try {
    html5QrCode = new Html5Qrcode('qr-reader')
    await html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 200, height: 200 } },
      async (decodedText) => {
        // Flash hijau sebentar sebelum stop kamera
        cameraQrDetected.value = true
        await stopCamera()
        setTimeout(async () => {
          cameraQrDetected.value = false
          await processBackendScan('qr-scan', decodedText)
        }, 600)
      },
      () => {}
    )
  } catch (err) {
    console.warn('Gagal mengakses kamera:', err)
  }
}

const stopCamera = async () => {
  if (html5QrCode && html5QrCode.isScanning) {
    await html5QrCode.stop()
    html5QrCode.clear()
    html5QrCode = null
  }
}

watch(activeScanMethod, async (newVal) => {
  await stopCamera()
  if (uploadPreviewUrl.value) { URL.revokeObjectURL(uploadPreviewUrl.value); uploadPreviewUrl.value = null }
  if (newVal === 'qr-scan' && !scanResult.value) { await nextTick(); startCamera() }
})
onMounted(async () => {
  if (activeScanMethod.value === 'qr-scan') { await nextTick(); startCamera() }
})
onBeforeUnmount(async () => { await stopCamera() })

// ── SCAN ──────────────────────────────────────────────────────────────────────
const processBackendScan = async (methodType, urlToScan) => {
  scanning.value = true
  const result = await scannerStore.performScan({ type: methodType, url: urlToScan })
  if (result.success) {
    scanResult.value = result.data
  } else {
    alert('Gagal memindai: ' + result.error)
    if (methodType === 'qr-scan') startCamera()
  }
  scanning.value = false
}

const handleUrlScan = async () => {
  if (!urlInput.value) return
  await processBackendScan('url-input', urlInput.value)
}

// ── FIX UPLOAD QR ─────────────────────────────────────────────────────────────
// Strategi: load gambar ke Image → draw ke canvas → ambil pixel → jsQR decode
// jsQR jauh lebih reliable daripada Html5Qrcode.scanFile untuk gambar statis.
// Fallback ke Html5Qrcode.scanFile dengan berbagai ukuran jika jsQR tidak ada.

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  if (fileInputRef.value)  fileInputRef.value.value  = ''
  if (fileInputRef2.value) fileInputRef2.value.value = ''

  // Tampilkan preview gambar segera
  if (uploadPreviewUrl.value) URL.revokeObjectURL(uploadPreviewUrl.value)
  uploadPreviewUrl.value = URL.createObjectURL(file)

  scanning.value = true
  try {
    const decodedUrl = await decodeQRFromFile(file)
    await processBackendScan('qr-upload', decodedUrl)
  } catch {
    alert('Tidak ada kode QR yang ditemukan pada gambar. Pastikan gambar jelas dan kode QR terlihat penuh.')
    scanning.value = false
  }
}

const decodeQRFromFile = (file) => {
  return new Promise((resolve, reject) => {
    const img    = new Image()
    const objUrl = URL.createObjectURL(file)

    img.onload = async () => {
      URL.revokeObjectURL(objUrl)

      // ① Coba jsQR (import dinamis – tidak perlu install jika sudah ada di node_modules)
      try {
        const mod  = await import('jsqr')
        const jsQR = mod.default

        // Coba beberapa skala: asli, 800px, 500px, 1200px, 300px
        for (const size of [Math.max(img.width, img.height), 800, 500, 1200, 300]) {
          const result = tryDecodeWithJsQR(img, size, jsQR)
          if (result) { resolve(result); return }
        }
      } catch {
        // jsQR tidak tersedia → lanjut ke fallback
      }

      // ② Fallback: Html5Qrcode.scanFile dengan berbagai ukuran
      for (const size of [800, 500, 1200, 300]) {
        try {
          const resized = await resizeToFile(img, size, file.type || 'image/jpeg')
          const text    = await Html5Qrcode.scanFile(resized, false)
          resolve(text); return
        } catch { /* coba ukuran berikutnya */ }
      }

      reject(new Error('QR tidak terdeteksi'))
    }

    img.onerror = () => { URL.revokeObjectURL(objUrl); reject(new Error('Gagal memuat gambar')) }
    img.src = objUrl
  })
}

/** Draw image ke canvas → jsQR baca pixel → return string atau null */
const tryDecodeWithJsQR = (img, targetSize, jsQR) => {
  try {
    const scale = Math.min(targetSize / img.width, targetSize / img.height, 2)
    const w = Math.round(img.width  * scale)
    const h = Math.round(img.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w; canvas.height = h
    canvas.getContext('2d').drawImage(img, 0, 0, w, h)
    const { data } = canvas.getContext('2d').getImageData(0, 0, w, h)
    const result   = jsQR(data, w, h, { inversionAttempts: 'dontInvert' })
    return result?.data || null
  } catch { return null }
}

/** Resize gambar ke File untuk Html5Qrcode.scanFile */
const resizeToFile = (img, targetSize, mimeType) => new Promise((resolve, reject) => {
  const scale  = Math.min(targetSize / img.width, targetSize / img.height, 1)
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  canvas.getContext('2d').drawImage(img, 0, 0, w, h)
  canvas.toBlob(
    blob => blob ? resolve(new File([blob], 'qr.jpg', { type: mimeType })) : reject(new Error('Blob gagal')),
    mimeType, 0.92
  )
})

// ── RESET & FEEDBACK ──────────────────────────────────────────────────────────
const resetScan = async () => {
  scanResult.value = null; urlInput.value = ''
  feedback.keterangan = ''; feedback.proposedStatus = ''
  feedbackSuccess.value = false
  if (uploadPreviewUrl.value) { URL.revokeObjectURL(uploadPreviewUrl.value); uploadPreviewUrl.value = null }
  if (activeScanMethod.value === 'qr-scan') { await nextTick(); startCamera() }
}

const submitFeedbackForm = async () => {
  submittingFeedback.value = true
  await scannerStore.submitFeedback(scanResult.value.id, feedback)
  submittingFeedback.value = false
  feedbackSuccess.value    = true
  feedback.keterangan      = ''
  feedback.proposedStatus  = ''
  setTimeout(() => { feedbackSuccess.value = false }, 5000)
}

const handleLogout = () => { authStore.logout(); router.push('/login') }
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace !important; }

/* Tabs */
.tab-active   { color:#2c63d1; background:#f4f7ff; border-color:rgba(44,99,209,0.15); border-bottom-color:#f4f7ff; }
.tab-inactive { color:#9baac5; background:transparent; border-color:transparent; }
.tab-inactive:hover { color:#2c63d1; background:rgba(44,99,209,0.05); }

/* Upload hover */
.upload-zone:hover { border-color:#2c63d1 !important; background:rgba(44,99,209,0.02) !important; }

/* Result states */
.result-danger { background:linear-gradient(135deg,#fff5f5,#fff0f0); border-color:rgba(239,68,68,0.2); }
.result-safe   { background:linear-gradient(135deg,#f0fdf4,#ecfdf5); border-color:rgba(34,197,94,0.2); }
.badge-danger  { background:rgba(239,68,68,0.1); color:#dc2626; border-color:rgba(239,68,68,0.25); }
.badge-safe    { background:rgba(34,197,94,0.1); color:#16a34a; border-color:rgba(34,197,94,0.25); }
.score-red     { color:#dc2626; }
.score-green   { color:#16a34a; }

/* Progress bar */
.bar-transition { transition:width 1s cubic-bezier(0.4,0,0.2,1); }
.bar-danger     { background:linear-gradient(90deg,#f87171,#dc2626); }
.bar-safe       { background:linear-gradient(90deg,#4ade80,#16a34a); }

/* QR corner guides */
.qr-corner { position:absolute; width:20px; height:20px; border-color:#2c63d1; transition:border-color .3s; }
.corner-found { border-color:#22c55e !important; }

/* QR Found flash overlay */
.qr-found-overlay { background:rgba(22,163,74,0.25); }
.qr-found-enter-active { transition:opacity .2s ease; }
.qr-found-leave-active { transition:opacity .4s ease; }
.qr-found-enter-from, .qr-found-leave-to { opacity:0; }

/* Scan line sweep animation for upload preview */
.scan-line-wrap {
  position:absolute; inset:0; overflow:hidden; pointer-events:none;
}
.scan-line {
  position:absolute; left:0; right:0; height:3px;
  background:linear-gradient(90deg, transparent, #2c63d1, #60a5fa, #2c63d1, transparent);
  box-shadow:0 0 12px 3px rgba(44,99,209,0.6);
  animation:scanSweep 1.4s ease-in-out infinite;
}
@keyframes scanSweep {
  0%   { top:5%; opacity:0; }
  10%  { opacity:1; }
  90%  { opacity:1; }
  100% { top:95%; opacity:0; }
}

/* Spinner */
.spinner { width:28px; height:28px; border-radius:50%; border:3px solid rgba(255,255,255,0.25); border-top-color:#ffffff; animation:spin .7s linear infinite; }
.spinner-sm { width:16px; height:16px; border-width:2px; }

/* Animations */
.anim-fade-up { animation:fadeUp .45s ease both; }
.anim-pulse   { animation:pulse 2s ease-in-out infinite; }

@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin   { to{transform:rotate(360deg)} }
@keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
</style>
