<script setup>
import { ref } from 'vue'

// Variable untuk menyimpan input URL
const urlInput = ref('')
const isLoading = ref(false)
const result = ref(null)

// Fungsi dummy (pura-pura mengecek)
const analyzeUrl = () => {
  if (!urlInput.value) return alert('Masukkan URL dulu bos!')

  isLoading.value = true
  result.value = null // Reset hasil

  // Simulasi loading 2 detik (nanti diganti koneksi ke Model AI)
  setTimeout(() => {
    isLoading.value = false
    result.value = {
      status: 'AMAN', // Nanti ini dinamis dari AI
      message: 'Website ini terlihat aman untuk dikunjungi.'
    }
  }, 2000)
}
</script>

<template>
  <div class="container">
    <div class="card">
      <h1>🔍 Phishing Detector</h1>
      <p>Cek apakah link website aman atau berbahaya menggunakan AI.</p>

      <div class="input-group">
        <input
          v-model="urlInput"
          type="text"
          placeholder="Tempel link mencurigakan disini (ex: http://bca-promo.com)..."
        />
        <button @click="analyzeUrl" :disabled="isLoading">
          {{ isLoading ? 'Menganalisis...' : 'Cek Sekarang' }}
        </button>
      </div>

      <div v-if="result" class="result-box" :class="result.status === 'AMAN' ? 'safe' : 'danger'">
        <h3>Hasil: {{ result.status }}</h3>
        <p>{{ result.message }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Style Sederhana biar rapi */
.container {
  display: flex;
  justify_content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
  font-family: Arial, sans-serif;
}

.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  text-align: center;
  max-width: 500px;
  width: 100%;
}

h1 { color: #2c3e50; margin-bottom: 0.5rem; }
p { color: #666; margin-bottom: 2rem; }

.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

button:disabled { background-color: #ccc; cursor: not-allowed; }

.result-box {
  margin-top: 20px;
  padding: 15px;
  border-radius: 8px;
}

.safe { background-color: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
.danger { background-color: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }
</style>
