<template>
  <div class="min-h-screen bg-primary pb-10">
    <Header />
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-black mb-2">Kunci API</h1>
          <p class="text-black/60">Kelola kunci akses untuk integrasi aplikasi Anda.</p>
        </div>

        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-[#2c63d1] hover:bg-opacity-90 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
        >
          <Plus class="w-5 h-5" />
          Buat Kunci Baru
        </button>
      </div>

      <div class="glass-effect rounded-2xl shadow-2xl overflow-hidden bg-[#2c63d1]/5 border border-[#2c63d1]/10">
        <div v-if="apiStore.isLoading && apiStore.apiKeys.length === 0" class="p-10 text-center text-black/60">
          Memuat kunci API...
        </div>

        <table v-else class="w-full">
          <thead class="bg-[#2c63d1]/20 border-b border-white/10">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Nama</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Prefix Kunci</th>
              <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Dibuat Pada</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-white/10">
            <tr v-for="key in apiStore.apiKeys" :key="key.id" class="hover:bg-white/5 transition-colors">
              <td class="px-6 py-4">
                <span class="font-semibold text-red-800">{{ key.name }}</span>
              </td>
              <td class="px-6 py-4">
                <code class="text-sm font-mono text-[#eded74] bg-black px-2 py-1 rounded">
                  {{ key.key_prefix }}••••••••••••••••
                </code>
              </td>
              <td class="px-6 py-4 text-sm text-black/60">
                {{ formatDate(key.created_at) }}
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="apiStore.apiKeys.length === 0 && !apiStore.isLoading" class="p-10 text-center">
          <Key class="w-12 h-12 text-black/40 mx-auto mb-3" />
          <h3 class="text-lg font-bold text-black">Belum Ada Kunci API</h3>
          <p class="text-black/60">Buat kunci pertama Anda untuk mulai menggunakan layanan SEQR.</p>
        </div>
      </div>
    </div>

    <div v-if="showCreateModal" class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#1e2530] rounded-2xl p-8 max-w-md w-full border border-white/10 shadow-2xl">
        <h3 class="text-2xl font-bold text-black mb-6">Buat Kunci API Baru</h3>
        <form @submit.prevent="handleCreateKey">
          <div class="mb-6">
            <label class="block text-sm font-medium text-black/80 mb-2">Nama Kunci</label>
            <input
              v-model="newKeyName"
              type="text"
              required
              placeholder="Contoh: Production Server"
              class="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eded74] text-black"
            />
          </div>

          <div v-if="apiStore.error" class="mb-4 text-red-400 text-sm">{{ apiStore.error }}</div>

          <div class="flex gap-3">
            <button type="button" @click="showCreateModal = false" class="flex-1 py-3 bg-white/10 hover:bg-white/20 text-black font-semibold rounded-lg">
              Batal
            </button>
            <button type="submit" :disabled="isCreating" class="flex-1 py-3 bg-[#2c63d1] hover:bg-[#2c63d1]/80 text-black font-bold rounded-lg disabled:opacity-50">
              {{ isCreating ? 'Membuat...' : 'Buat Kunci' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showSecretModal" class="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div class="bg-[#1e2530] rounded-2xl p-8 max-w-lg w-full border border-green-500/30 shadow-2xl">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle class="w-6 h-6 text-green-400" />
          </div>
          <h3 class="text-2xl font-bold text-black">Kunci API Berhasil Dibuat!</h3>
        </div>

        <p class="text-yellow-400 font-semibold mb-2">⚠️ PENTING: Simpan kunci ini sekarang!</p>
        <p class="text-black/70 text-sm mb-6">
          Demi keamanan, kami tidak akan pernah menampilkan kunci ini lagi. Jika Anda kehilangannya, Anda harus membuat kunci baru.
        </p>

        <div class="bg-black/40 border border-white/10 rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
          <code class="text-[#eded74] font-mono break-all">{{ generatedSecretKey }}</code>
          <button @click="copyToClipboard" class="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" title="Copy to clipboard">
            <Copy class="w-5 h-5 text-black" />
          </button>
        </div>

        <button @click="showSecretModal = false" class="w-full py-3 bg-white/10 hover:bg-white/20 text-black font-bold rounded-lg transition-all">
          Saya sudah menyimpannya
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Header, Navbar } from './components'
import { useApiStore } from '@/stores/developer/api'
import { Plus, Key, Copy, CheckCircle } from 'lucide-vue-next'

const apiStore = useApiStore()

const showCreateModal = ref(false)
const showSecretModal = ref(false)
const isCreating = ref(false)
const newKeyName = ref('')
const generatedSecretKey = ref('')

onMounted(async () => {
  await apiStore.fetchApiKeys()
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric'
  })
}

const handleCreateKey = async () => {
  isCreating.value = true
  const result = await apiStore.createApiKey(newKeyName.value)
  isCreating.value = false

  if (result.success) {
    showCreateModal.value = false // Tutup modal input nama
    newKeyName.value = '' // Reset input

    generatedSecretKey.value = result.rawKey // Masukkan raw key dari backend
    showSecretModal.value = true // Buka modal peringatan secret key
  }
}

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(generatedSecretKey.value)
    alert('Kunci API berhasil disalin ke clipboard!')
  } catch (err) {
    console.error('Gagal menyalin:', err)
  }
}
</script>
