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
          Tambah Model Baru
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in">
        <div
          v-for="model in adminStore.mlModels"
          :key="model.id"
          class="glass-effect rounded-2xl p-6 shadow-2xl  border border-black/10"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-bold text-black">{{ model.name }}</h3>
                <span
                  :class="[
                    'text-xs font-semibold px-2 py-1 rounded',
                    model.status === 'active'
                      ? 'bg-[#22c55e]/20 text-[#4ade80]' /* Hijau */
                      : 'bg-white/10 text-[#F21313]/60'
                  ]"
                >
                  {{ model.status === 'active' ? 'Aktif' : 'Tidak Aktif' }}
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
              <span class="text-black font-mono">{{ model.trainedSamples.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-black/60">Dibuat</span>
              <span class="text-black">{{ formatDate(model.createdAt) }}</span>
            </div>
          </div>

          <button
            @click="adminStore.toggleModelStatus(model.id)"
            :class="[
              'w-full py-2 font-semibold rounded-lg transition-all border',
              model.status === 'active'
                ? 'bg-[#2c63d1] hover:bg-white/20 text-white border-transparent'
                : 'bg-[#22c55e] hover:bg-[#16a34a] text-white border-transparent'
            ]"
          >
            {{ model.status === 'active' ? 'Nonaktifkan' : 'Aktifkan' }}
          </button>
        </div>
      </div>

      <div v-if="adminStore.mlModels.length === 0" class="glass-effect rounded-2xl p-16 text-center shadow-2xl bg-white/5 border border-white/10 fade-in mt-6">
        <Brain class="w-20 h-20 text-black/40 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-black mb-2">Belum Ada Model</h3>
        <p class="text-black/60 mb-6">Buat model ML pertama Anda untuk mulai mendeteksi ancaman</p>
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-[#eded74] hover:bg-opacity-90 text-[#1e2530] font-bold rounded-lg transition-all inline-flex items-center gap-2 shadow-lg shadow-[#eded74]/30"
        >
          <Plus class="w-5 h-5" />
          Tambah Model Baru
        </button>
      </div>
    </div>

    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in"
      @click.self="showCreateModal = false"
    >
      <div class="glass-effect rounded-2xl p-8 max-w-lg w-full shadow-2xl bg-[#1e2530] border border-white/10">
        <h3 class="text-2xl font-bold text-black mb-6">Buat Model Baru</h3>

        <form @submit.prevent="createModel" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-black/80 mb-2">
              Nama Model
            </label>
            <input
              v-model="newModel.name"
              type="text"
              required
              placeholder="Contoh: Random Forest Classifier v3.0"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] focus:border-transparent text-black placeholder-white/40"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-black/80 mb-2">
              Tipe Model
            </label>
            <select
              v-model="newModel.type"
              required
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] focus:border-transparent text-black"
            >
              <option value="" class="bg-[#1e2530]">Pilih tipe</option>
              <option value="Random Forest" class="bg-[#1e2530]">Random Forest</option>
              <option value="Deep Learning" class="bg-[#1e2530]">Deep Learning</option>
              <option value="Support Vector Machine" class="bg-[#1e2530]">Support Vector Machine</option>
              <option value="Naive Bayes" class="bg-[#1e2530]">Naive Bayes</option>
              <option value="Gradient Boosting" class="bg-[#1e2530]">Gradient Boosting</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-black/80 mb-2">
              Akurasi (%)
            </label>
            <input
              v-model.number="newModel.accuracy"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="Contoh: 95.5"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] focus:border-transparent text-black placeholder-white/40"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-black/80 mb-2">
              Sampel Pelatihan
            </label>
            <input
              v-model.number="newModel.trainedSamples"
              type="number"
              min="0"
              placeholder="Contoh: 100000"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] focus:border-transparent text-black placeholder-white/40"
            />
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 py-3 bg-white/10 hover:bg-white/20 text-black font-semibold rounded-lg transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 py-3 bg-[#eded74] hover:bg-opacity-90 text-[#1e2530] font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!creating">Buat Model</span>
              <span v-else class="loading-dots">Membuat</span>
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
          <h3 class="text-2xl font-bold text-black">Hapus Model?</h3>
        </div>

        <p class="text-black/80 mb-6">
          Apakah Anda yakin ingin menghapus <strong class="text-black">{{ modelToDelete?.name }}</strong>?
          Tindakan ini tidak dapat dibatalkan.
        </p>

        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-3 bg-white/10 hover:bg-white/20 text-black font-semibold rounded-lg transition-all"
          >
            Batal
          </button>
          <button
            @click="deleteModel"
            :disabled="deleting"
            class="flex-1 py-3 bg-[#ef4444] hover:bg-[#dc2626] text-black font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import {
  Shield, LogOut, LayoutDashboard, Brain, MessageSquare, History,
  Plus, Trash2, AlertTriangle
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const adminStore = useAdminStore()

const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const creating = ref(false)
const deleting = ref(false)
const modelToDelete = ref(null)

const newModel = reactive({
  name: '',
  type: '',
  accuracy: null,
  trainedSamples: null
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

// Format tanggal disesuaikan ke format Indonesia
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const createModel = async () => {
  creating.value = true
  await adminStore.createModel(newModel)
  showCreateModal.value = false

  // Reset form
  newModel.name = ''
  newModel.type = ''
  newModel.accuracy = null
  newModel.trainedSamples = null

  creating.value = false
}

const confirmDelete = (model) => {
  modelToDelete.value = model
  showDeleteModal.value = true
}

const deleteModel = async () => {
  deleting.value = true
  await adminStore.deleteModel(modelToDelete.value.id)
  showDeleteModal.value = false
  modelToDelete.value = null
  deleting.value = false
}
</script>
