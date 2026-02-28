<template>
  <div class="flex h-screen bg-[#f1f5f9] font-sans overflow-hidden">

    <aside class="flex flex-col w-64 bg-white border-r border-[#e2e8f0] shadow-sm z-10">

      <div class="flex items-center justify-center h-16 border-b border-[#e2e8f0]">
        <h1 class="text-xl font-bold text-[#1e293b]">PhishGuard Admin</h1>
      </div>

      <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        <router-link
          to="/admin/dashboard"
          class="flex items-center px-4 py-3 text-sm font-medium transition-colors rounded-xl"
          :class="[
            $route.path === '/admin/dashboard'
              ? 'bg-[#eff6ff] text-[#2563eb]' // Aktif (Biru)
              : 'text-[#64748b] hover:bg-[#f8fafc] hover:text-[#1e293b]' // Tidak Aktif (Abu-abu)
          ]"
        >
          <LayoutDashboard class="w-5 h-5 mr-3" />
          Dashboard
        </router-link>

        </nav>

      <div class="p-4 border-t border-[#e2e8f0]">
        <button
          @click="handleLogout"
          class="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-[#b91c1c] transition-colors rounded-xl bg-[#fee2e2] hover:bg-[#fca5a5]"
        >
          <LogOut class="w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

    </aside>

    <main class="flex-1 overflow-y-auto">
      <div class="p-8">
        <router-view />
      </div>
    </main>

  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
// Mengambil ikon dari library Lucide yang sudah kita install sebelumnya
import { LayoutDashboard, LogOut } from 'lucide-vue-next';

const router = useRouter();
const route = useRoute(); // Digunakan untuk mengecek menu mana yang sedang aktif

const handleLogout = () => {
  // Hapus token JWT dan kembalikan ke halaman depan
  localStorage.removeItem('access_token');
  router.push('/');
};
</script>
