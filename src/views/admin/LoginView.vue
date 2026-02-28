<template>
  <div class="flex items-center justify-center min-h-screen bg-[#f8fafc] px-4">
    <div class="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl">
      <div class="mb-8 text-center">
        <h2 class="text-2xl font-bold text-[#1e293b]">Login Admin</h2>
        <p class="mt-2 text-sm text-[#64748b]">Silakan masuk untuk melihat riwayat deteksi.</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div>
          <label class="block mb-1 text-sm font-medium text-[#334155]">Username</label>
          <input
            v-model="username"
            type="text"
            required
            class="w-full px-4 py-3 border border-[#cbd5e1] rounded-xl outline-none focus:border-[#2563eb]"
          />
        </div>

        <div>
          <label class="block mb-1 text-sm font-medium text-[#334155]">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-4 py-3 border border-[#cbd5e1] rounded-xl outline-none focus:border-[#2563eb]"
          />
        </div>

        <div v-if="errorMessage" class="p-3 text-sm text-[#b91c1c] bg-[#fee2e2] rounded-lg">
          {{ errorMessage }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="flex items-center justify-center w-full py-3 font-semibold text-white transition-colors bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8] disabled:opacity-50"
        >
          <span v-if="!isLoading">Masuk</span>
          <span v-else>Memproses...</span>
        </button>
      </form>

      <div class="mt-6 text-center">
        <button @click="$router.push('/')" class="text-sm text-[#2563eb] hover:underline">
          &larr; Kembali ke Beranda
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../utils/axios';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  errorMessage.value = '';
  isLoading.value = true;

  const params = new URLSearchParams();
  params.append('username', username.value);
  params.append('password', password.value);

  try {
    const response = await api.post('/auth/login', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    localStorage.setItem('access_token', response.data.access_token);

    router.push('/admin/dashboard');
  } catch (error) {
    if (error.response && error.response.status === 401) {
      errorMessage.value = "Username atau password salah!";
    } else {
      errorMessage.value = "Gagal terhubung ke server.";
    }
  } finally {
    isLoading.value = false;
  }
};
</script>
