<template>
  <div class="space-y-6">

    <div class="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h2 class="text-2xl font-bold text-[#1e293b]">Dashboard & Riwayat</h2>
        <p class="text-sm text-[#64748b]">Daftar URL yang pernah dicek oleh sistem.</p>
      </div>
      <button
        @click="downloadReport"
        :disabled="isDownloading"
        class="flex items-center px-5 py-2.5 text-sm font-medium text-white transition-colors bg-[#047857] rounded-lg hover:bg-[#065f46] disabled:opacity-50"
      >
        <span v-if="!isDownloading">Download PDF Report</span>
        <span v-else>Memproses PDF...</span>
      </button>
    </div>

    <div v-if="isLoading" class="py-12 bg-white border border-[#e2e8f0] shadow-sm rounded-xl">
      <LoadingSpinner>Memuat riwayat deteksi...</LoadingSpinner>
    </div>

    <div v-else class="overflow-hidden bg-white border border-[#e2e8f0] shadow-sm rounded-xl">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-[#e2e8f0]">
          <thead class="bg-[#f8fafc]">
            <tr>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#64748b] uppercase">Waktu</th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-left text-[#64748b] uppercase">URL Target</th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-center text-[#64748b] uppercase">Status</th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-center text-[#64748b] uppercase">Probabilitas</th>
              <th scope="col" class="px-6 py-3 text-xs font-medium tracking-wider text-center text-[#64748b] uppercase">Hit Count</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-[#e2e8f0]">
            <tr v-if="historyData.length === 0">
              <td colspan="5" class="px-6 py-10 text-center text-[#64748b]">Belum ada riwayat deteksi.</td>
            </tr>
            <tr v-for="item in historyData" :key="item.id" class="hover:bg-[#f8fafc]">
              <td class="px-6 py-4 text-sm text-[#334155] whitespace-nowrap">
                {{ formatDate(item.created_at) }}
              </td>
              <td class="px-6 py-4 text-sm text-[#1e293b] max-w-xs truncate" :title="item.url">
                {{ item.url }}
              </td>
              <td class="px-6 py-4 text-center whitespace-nowrap">
                <span
                  class="px-3 py-1 text-xs font-semibold rounded-full"
                  :class="item.status === 'phishing' ? 'bg-[#fee2e2] text-[#b91c1c]' : 'bg-[#d1fae5] text-[#047857]'"
                >
                  {{ item.status.toUpperCase() }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-center text-[#334155] whitespace-nowrap">
                {{ (item.phishing_prob * 100).toFixed(1) }}%
              </td>
              <td class="px-6 py-4 text-sm text-center text-[#334155] whitespace-nowrap">
                {{ item.hit_count }}x
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../../utils/axios';
import LoadingSpinner from '../../components/LoadingSpinner.vue';

const historyData = ref([]);
const isLoading = ref(true);
const isDownloading = ref(false);

const fetchHistory = async () => {
  try {
    const response = await api.get('/admin/history?limit=100');
    historyData.value = response.data;
  } catch (error) {
    console.error("Gagal mengambil riwayat", error);
    if(error.response && error.response.status === 401) {
      alert("Sesi berakhir, silakan login kembali.");
      localStorage.removeItem('access_token');
      window.location.reload();
    }
  } finally {
    isLoading.value = false;
  }
};

const downloadReport = async () => {
  isDownloading.value = true;
  try {
    const response = await api.get('/admin/report', { responseType: 'blob' });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Report_Phishing.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    alert("Gagal mengunduh laporan.");
  } finally {
    isDownloading.value = false;
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString + 'Z');
  return date.toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
};

onMounted(() => {
  fetchHistory();
});
</script>
