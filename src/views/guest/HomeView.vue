<template>
  <div class="flex flex-col items-center justify-center min-h-screen p-4 bg-[#f8fafc]">
    <div class="w-full max-w-lg p-8 bg-white shadow-xl rounded-2xl">

      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-[#6c7c8b]">PhishGuard</h1>
        <p class="mt-2 text-sm text-[#64748b]">Deteksi URL Phishing & Berbahaya dengan Cepat</p>
      </div>

      <div class="flex p-1 mb-6 bg-[#f1f5f9] rounded-xl">
        <button
          @click="activeTab = 'url'"
          :class="['flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer', activeTab === 'url' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-[#64748b] hover:text-[#334155]']"
        >
          Input URL
        </button>
        <button
          @click="activeTab = 'qr'"
          :class="['flex-1 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer', activeTab === 'qr' ? 'bg-white text-[#2563eb] shadow-sm' : 'text-[#64748b] hover:text-[#334155]']"
        >
          Scan QR Code
        </button>
      </div>

      <div v-if="activeTab === 'url'" class="space-y-5">
        <div>
          <label class="block mb-2 text-sm font-medium text-[#334155]">Masukkan Link / URL</label>
          <input
            v-model="inputUrl"
            type="text"
            placeholder="https://contoh.com"
            class="w-full px-4 py-3 border border-[#cbd5e1] rounded-xl focus:ring-2 focus:ring-[#3b82f6] focus:border-[#3b82f6] outline-none transition-all"
            @keyup.enter="handleManualSubmit"
          />
        </div>
        <button
          @click="handleManualSubmit"
          :disabled="!inputUrl"
          class="w-full py-3 font-semibold text-white transition-colors mt-1 bg-[#2563eb] rounded-xl cursor-pointer hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Deteksi Sekarang
        </button>
      </div>

      <div v-else-if="activeTab === 'qr'" class="space-y-4">
        <div class="overflow-hidden border-2 border-dashed rounded-xl border-[#cbd5e1] bg-[#f8fafc]">

          <qrcode-stream
            v-if="cameraActive"
            @detect="onDetect"
            @camera-on="onCameraReady"
            @error="onCameraError"
            class="w-full h-64"
          >
            <div v-if="loadingCamera" class="flex items-center justify-center w-full h-full absolute inset-0 bg-[#f8fafc] z-10">
               <LoadingSpinner>Menyiapkan Kamera...</LoadingSpinner>
            </div>
          </qrcode-stream>

          <div v-else class="flex flex-col items-center justify-center h-64 p-6 text-center">
            <qrcode-capture @detect="onDetect" class="mb-4" />
            <p class="text-xs text-[#64748b]">Atau upload gambar QR Code dari galeri Anda.</p>
          </div>

        </div>

        <button
          @click="toggleCamera"
          class="w-full py-2 text-sm font-medium transition-colors mt-1 border border-[#2563eb] rounded-xl text-[#2563eb] hover:bg-[#eff6ff] cursor-pointer"
        >
          {{ cameraActive ? 'Matikan Kamera & Gunakan File' : 'Nyalakan Kamera Scanner' }}
        </button>
      </div>

      <div v-if="errorMessage" class="p-3 mt-4 text-sm text-[#c9322c] bg-[#f72b2b] border border-[#f72b2b] rounded-lg">
        {{ errorMessage }}
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { QrcodeStream, QrcodeCapture } from 'vue-qrcode-reader';
import LoadingSpinner from '../../components/LoadingSpinner.vue';
import { isValidUrl } from '../../utils/validators';

const router = useRouter();

// State
const activeTab = ref('url');
const inputUrl = ref('');
const errorMessage = ref('');

// State untuk QR Scanner
const cameraActive = ref(true);
const loadingCamera = ref(true);

// Fungsi Submit URL Manual
const handleManualSubmit = () => {
  errorMessage.value = '';
  const url = inputUrl.value.trim();

  if (!url) return;

  // Validasi format URL menggunakan Utils yang kita buat di Langkah 1
  if (!isValidUrl(url)) {
    errorMessage.value = "Format tidak valid! Harap masukkan URL yang benar (misal: http://google.com)";
    return;
  }

  // Jika Valid, arahkan ke halaman Result (lempar data lewat query parameter)
  router.push({ path: '/result', query: { target: url } });
};

// Fungsi ketika QR berhasil terbaca (Kamera atau Gambar)
const onDetect = (detectedCodes) => {
  errorMessage.value = '';
  try {
    // Ambil teks hasil scan pertama
    const rawValue = detectedCodes[0].rawValue;

    // Validasi apakah teks dari QR adalah URL
    if (isValidUrl(rawValue)) {
       // Matikan kamera dan arahkan ke result
       cameraActive.value = false;
       router.push({ path: '/result', query: { target: rawValue } });
    } else {
       errorMessage.value = `QR Code tidak berisi URL yang valid. Isi QR: "${rawValue}"`;
    }
  } catch (err) {
    errorMessage.value = "Gagal membaca QR Code.";
  }
};

// Toggle Kamera
const toggleCamera = () => {
  cameraActive.value = !cameraActive.value;
  if(cameraActive.value) loadingCamera.value = true;
};

// Lifecycle Kamera
const onCameraReady = () => {
  loadingCamera.value = false;
};

const onCameraError = (error) => {
  loadingCamera.value = false;
  cameraActive.value = false;
  if (error.name === 'NotAllowedError') {
    errorMessage.value = "Akses kamera ditolak oleh browser Anda.";
  } else {
    errorMessage.value = "Kamera tidak tersedia atau error.";
  }
};
</script>
