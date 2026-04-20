<template>
  <div class="min-h-screen">
    <Header />
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 fade-in">
        <WelcomeMessage title="Manajemen Model" message="Kelola model machine learning Anda untuk deteksi ancaman." />

        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-[#2c63d1] hover:bg-opacity-90 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2c63d1]/30"
        >
          <Plus class="w-5 h-5" />
          Unggah Model Baru
        </button>
      </div>

      <div v-if="modelStore.error && !showCreateModal" class="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6 fade-in">
        <strong class="font-bold">Error! </strong>
        <span>{{ modelStore.error }}</span>
      </div>

      <div v-if="modelStore.isLoading && modelStore.mlModels.length === 0" class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="w-12 h-12 border-4 border-[#2c63d1] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-black/60 font-mono">Memuat model dari server...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in">
        <div
          v-for="model in modelStore.mlModels"
          :key="model.id"
          class="glass-effect rounded-2xl p-6 shadow-2xl border border-black/10"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-bold text-black">{{ model.name || model.filename }}</h3>
                <span
                  :class="[
                    'text-xs font-semibold px-2 py-1 rounded',
                    model.is_active || model.status === 'active'
                      ? 'bg-[#22c55e]/20 text-[#4ade80]'
                      : 'bg-[#ef4444]/10 text-[#ef4444]'
                  ]"
                >
                  {{ model.is_active || model.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
                </span>
              </div>
              <p class="text-sm text-black/60">{{ model.type }}</p>
            </div>
            <button
              @click="confirmDelete(model)"
              class="p-2 hover:bg-[#ef4444]/20 rounded-lg transition-colors group"
              title="Hapus model"
            >
              <Trash2 class="w-5 h-5 text-black/60 group-hover:text-[#f87171]" />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="bg-[#2c63d1]/50 rounded-lg p-3 border border-white/10">
              <p class="text-xs text-black/50 mb-1">Akurasi</p>
              <p class="text-2xl font-bold text-white">{{ model.accuracy }}%</p>
            </div>
            <div class="bg-[#2c63d1]/50 rounded-lg p-3 border border-white/10">
              <p class="text-xs text-black/50 mb-1">Versi</p>
              <p class="text-2xl font-bold text-white font-mono">{{ model.version }}</p>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-black/60">Sampel Pelatihan</span>
              <span class="text-black font-mono">{{ (model.trainedSamples || 0).toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-black/60">Dibuat</span>
              <span class="text-black">{{ formatDate(model.createdAt || model.created_at) }}</span>
            </div>
          </div>

          <button
            @click="modelStore.toggleModelStatus(model.id)"
            :class="[
              'w-full py-2 font-semibold rounded-lg transition-all border',
              model.is_active || model.status === 'active'
                ? 'bg-[#2c63d1] hover:bg-white/20 text-white border-transparent'
                : 'bg-[#22c55e] hover:bg-[#16a34a] text-white border-transparent'
            ]"
          >
            {{ model.is_active || model.status === 'active' ? 'Nonaktifkan' : 'Aktifkan' }}
          </button>
        </div>
      </div>

      <div v-if="modelStore.mlModels.length === 0 && !modelStore.isLoading" class="glass-effect rounded-2xl p-16 text-center shadow-2xl bg-white/5 border border-white/10 fade-in mt-6">
        <Brain class="w-20 h-20 text-black/40 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-black mb-2">Belum Ada Model</h3>
        <p class="text-black/60 mb-6">Unggah model .joblib pertama Anda untuk mulai mendeteksi ancaman</p>
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-[#eded74] hover:bg-opacity-90 text-[#1e2530] font-bold rounded-lg transition-all inline-flex items-center gap-2 shadow-lg shadow-[#eded74]/30"
        >
          <Plus class="w-5 h-5" />
          Unggah Model
        </button>
      </div>
    </div>

    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in overflow-y-auto"
      @click.self="showCreateModal = false"
    >
      <div class="glass-effect rounded-2xl p-8 max-w-lg w-full shadow-2xl bg-[#1e2530] border border-white/10 my-8">
        <h3 class="text-2xl font-bold text-white mb-6">Unggah Model Baru</h3>

        <div v-if="modalError" class="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-sm">
          {{ modalError }}
        </div>

        <form @submit.prevent="submitModel" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">
              File Model (.joblib)
            </label>
            <input
              type="file"
              accept=".joblib"
              @change="handleFileChange"
              required
              class="w-full px-4 py-2 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#eded74] file:text-[#1e2530] hover:file:bg-[#eded74]/80"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Nama Model (Opsional)</label>
            <input
              v-model="newModel.name"
              type="text"
              placeholder="Contoh: Random Forest v2"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] text-white placeholder-white/40"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Tipe Algoritma</label>
            <select
              v-model="newModel.type"
              required
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] text-white"
            >
              <option value="" class="bg-[#1e2530]">Pilih tipe</option>
              <option value="Random Forest" class="bg-[#1e2530]">Random Forest</option>
              <option value="Deep Learning" class="bg-[#1e2530]">Deep Learning</option>
              <option value="Support Vector Machine" class="bg-[#1e2530]">Support Vector Machine</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Akurasi (%)</label>
            <input
              v-model.number="newModel.accuracy"
              type="number"
              min="0" max="100" step="0.1" required
              placeholder="Contoh: 95.5"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] text-white placeholder-white/40"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Sampel Pelatihan</label>
            <input
              v-model.number="newModel.trainedSamples"
              type="number" min="0" required
              placeholder="Contoh: 100000"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] text-white placeholder-white/40"
            />
          </div>

          <div class="flex gap-3 mt-6">
            <button
              type="button"
              @click="closeCreateModal"
              class="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="uploading"
              class="flex-1 py-3 bg-[#eded74] hover:bg-opacity-90 text-[#1e2530] font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!uploading">Unggah Model</span>
              <span v-else class="loading-dots">Mengunggah</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in"
      @click.self="showDeleteModal = false"
    >
      <div class="glass-effect rounded-2xl p-8 max-w-md w-full shadow-2xl bg-[#1e2530] border border-white/10">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-full bg-[#ef4444]/20 flex items-center justify-center">
            <AlertTriangle class="w-6 h-6 text-[#f87171]" />
          </div>
          <h3 class="text-2xl font-bold text-white">Hapus Model?</h3>
        </div>

        <p class="text-white/80 mb-6">
          Apakah Anda yakin ingin menghapus <strong class="text-[#eded74]">{{ modelToDelete?.name || modelToDelete?.filename }}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <p v-if="modalError" class="text-red-400 text-sm mb-4">{{ modalError }}</p>

        <div class="flex gap-3">
          <button
            @click="closeDeleteModal"
            class="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
          >
            Batal
          </button>
          <button
            @click="deleteModel"
            :disabled="deleting"
            class="flex-1 py-3 bg-[#ef4444] hover:bg-[#dc2626] text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!deleting">Hapus</span>
            <span v-else class="loading-dots">Menghapus</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Header, Navbar, WelcomeMessage, StatCard, QuickAction, UsageChart, ActivateCard } from './components'
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
// Menggunakan store yang baru kita buat
import { useModelStore } from '@/stores/model'
import {
  Shield, LogOut, LayoutDashboard, Brain, MessageSquare, History,
  Plus, Trash2, AlertTriangle
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const modelStore = useModelStore()

const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const uploading = ref(false)
const deleting = ref(false)

const modelToDelete = ref(null)
const selectedFile = ref(null)
const modalError = ref('')

const newModel = reactive({
  name: '',
  type: '',
  accuracy: null,
  trainedSamples: null
})

// Mengambil model dari API saat dimuat
onMounted(async () => {
  await modelStore.fetchModels()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Fungsi untuk validasi file saat di-browse
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file && !file.name.endsWith('.joblib')) {
    modalError.value = 'Mohon maaf, hanya file dengan ekstensi .joblib yang diizinkan.'
    event.target.value = ''
    selectedFile.value = null
  } else {
    selectedFile.value = file
    modalError.value = ''
    if (!newModel.name) {
      newModel.name = file.name.replace('.joblib', '')
    }
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  modalError.value = ''
  selectedFile.value = null
  newModel.name = ''
  newModel.type = ''
  newModel.accuracy = null
  newModel.trainedSamples = null
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  modelToDelete.value = null
  modalError.value = ''
}

// Fungsi baru untuk submit model ke backend
const submitModel = async () => {
  if (!selectedFile.value) {
    modalError.value = 'Silakan unggah file model terlebih dahulu.'
    return
  }

  uploading.value = true
  modalError.value = ''

  // Format objek ini akan di-parse menjadi string JSON di store
  const performanceData = {
    name: newModel.name || selectedFile.value.name,
    type: newModel.type,
    accuracy: newModel.accuracy,
    trainedSamples: newModel.trainedSamples,
    version: "1.0.0"
  }

  const result = await modelStore.uploadModel(selectedFile.value, performanceData)

  if (result.success) {
    closeCreateModal()
  } else {
    modalError.value = result.error
  }

  uploading.value = false
}

const confirmDelete = (model) => {
  modelToDelete.value = model
  modalError.value = ''
  showDeleteModal.value = true
}

const deleteModel = async () => {
  deleting.value = true
  modalError.value = ''

  const result = await modelStore.deleteModel(modelToDelete.value.id)

  if (result.success) {
    closeDeleteModal()
  } else {
    modalError.value = result.error
  }

  deleting.value = false
}
</script>
