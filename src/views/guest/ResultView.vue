<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-[#f8fafc]">
    <div class="w-full max-w-lg p-8 bg-white shadow-xl rounded-2xl text-center">

      <div v-if="isLoading" class="py-10">
        <LoadingSpinner>Menganalisis URL dengan Machine Learning...</LoadingSpinner>
      </div>

      <div v-else-if="errorMessage" class="py-6">
        <div class="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-[#fee2e2] text-[#b91c1c]">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </div>
        <h2 class="text-xl font-bold text-[#1e293b]">Terjadi Kesalahan</h2>
        <p class="mt-2 text-sm text-[#64748b]">{{ errorMessage }}</p>
        <button @click="goBack" class="mt-6 px-6 py-2 text-sm font-medium text-white transition-colors bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8]">
          Kembali ke Beranda
        </button>
      </div>

      <div v-else class="py-2">
        <div
          class="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full"
          :class="isPhishing ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#d1fae5] text-[#047857]'"
        >
          <svg v-if="isPhishing" class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          <svg v-else class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        </div>

        <h2 class="text-2xl font-bold text-[#1e293b] mb-1">
          {{ isPhishing ? 'Peringatan: URL Berbahaya!' : 'URL Terlihat Aman' }}
        </h2>

        <div class="p-3 my-4 break-all border rounded-lg bg-[#f8fafc] text-[#334155] border-[#cbd5e1] text-sm">
          {{ targetUrl }}
        </div>

        <div class="flex justify-between items-center p-4 mb-6 rounded-xl" :class="isPhishing ? 'bg-[#fef2f2]' : 'bg-[#ecfdf5]'">
          <span class="text-sm font-semibold" :class="isPhishing ? 'text-[#991b1b]' : 'text-[#065f46]'">
            Tingkat Keyakinan Model:
          </span>
          <span class="text-lg font-bold" :class="isPhishing ? 'text-[#b91c1c]' : 'text-[#047857]'">
            {{ (probability * 100).toFixed(1) }}%
          </span>
        </div>

        <button @click="goBack" class="w-full py-3 font-semibold text-white transition-colors bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8]">
          Cek URL Lainnya
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import api from '../../utils/axios';

const route = useRoute();
const router = useRouter();

// State
const targetUrl = ref('');
const isLoading = ref(true);
const errorMessage = ref('');
const resultData = ref(null);

// Computed properties untuk mempermudah render UI
const isPhishing = computed(() => resultData.value?.status === 'phishing');
const probability = computed(() => resultData.value?.probability || resultData.value?.phishing_probability || 0);

// Fungsi untuk kembali ke halaman utama
const goBack = () => {
  router.push('/');
};

// Fungsi memanggil API FastAPI
const detectUrl = async (url) => {
  try {
    // Kita menembak endpoint /detect yang ada di main.py (backend)
    const response = await api.post('/detect', { url: url });
    resultData.value = response.data;
  } catch (error) {
    if (error.response) {
      errorMessage.value = `Gagal: ${error.response.data.detail || 'Terjadi kesalahan di server.'}`;
    } else {
      errorMessage.value = "Tidak dapat terhubung ke server backend. Pastikan FastAPI sudah menyala.";
    }
  } finally {
    isLoading.value = false;
  }
};

// Dijalankan otomatis saat halaman Result terbuka
onMounted(() => {
  // Ambil URL dari parameter (contoh: /result?target=http://google.com)
  const urlToDetect = route.query.target;

  if (!urlToDetect) {
    errorMessage.value = "URL tidak ditemukan. Silakan input dari halaman utama.";
    isLoading.value = false;
    return;
  }

  targetUrl.value = urlToDetect;

  // Berikan sedikit delay 500ms agar animasi loading terlihat natural, lalu tembak API
  setTimeout(() => {
    detectUrl(urlToDetect);
  }, 500);
});
</script>
