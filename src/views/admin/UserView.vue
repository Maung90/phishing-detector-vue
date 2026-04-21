<template>
  <div class="min-h-screen pb-10">
    <Header />
    <Navbar />

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8 fade-in">
        <WelcomeMessage title="Manajemen Pengguna" message="Kelola pengguna SEQR dan pantau penggunaan API Key mereka." />
      </div>

      <div v-if="usersStore.isLoading" class="flex flex-col items-center justify-center py-16 space-y-4">
        <div class="w-12 h-12 border-4 border-[#2c63d1] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-black/60 font-mono">Memuat data pengguna...</p>
      </div>

      <div v-else>
        <div v-if="usersStore.error" class="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg mb-6">
          <strong class="font-bold">Error! </strong>
          <span>{{ usersStore.error }}</span>
        </div>

        <div class="glass-effect rounded-2xl shadow-2xl overflow-hidden fade-in bg-[#2c63d1]/5 border border-[#2c63d1]/10">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-[#2c63d1]/20 border-b border-black/10">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">User ID</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Username & Email</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Role</th>
                  <th class="px-6 py-4 text-center text-xs font-semibold text-black/60 uppercase tracking-wider">Jumlah API Key</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Terakhir Login</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-black/60 uppercase tracking-wider">Bergabung Pada</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-black/10">
                <tr v-for="(user, index) in usersStore.users" :key="user.id" class="hover:bg-[#2c63d1]/5 transition-colors">
                  <td class="px-6 py-4">
                    <code class="text-sm font-mono text-[#2c63d1] font-bold">{{ index + 1 }}</code>
                  </td>
                  <td class="px-6 py-4">
                    <p class="font-semibold text-black">{{ user.username }}</p>
                    <p class="text-sm text-black/60">{{ user.email }}</p>
                  </td>
                  <td class="px-6 py-4">
                    <span :class="[
                      'inline-flex items-center gap-1 px-3 py-1 rounded-lg font-semibold text-xs border',
                      user.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-600 border-purple-500/50'
                        : 'bg-black/10 text-black/70 border-black/20'
                    ]">
                      <Shield v-if="user.role === 'admin'" class="w-3 h-3" />
                      <UserIcon v-else class="w-3 h-3" />
                      {{ user.role.toUpperCase() }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#eded74] text-[#1e2530] font-bold">
                      {{ user.total_api_keys }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-black/60">
                    {{ formatDate(user.last_login) }}
                  </td>
                  <td class="px-6 py-4 text-sm text-black/60">
                    {{ formatDate(user.created_at) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="usersStore.users.length === 0 && !usersStore.error" class="text-center py-16">
            <Users class="w-16 h-16 text-black/30 mx-auto mb-4" />
            <h3 class="text-xl font-semibold text-black mb-2">Tidak Ada Pengguna</h3>
            <p class="text-black/60">Sistem belum memiliki pengguna terdaftar.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { Header, Navbar, WelcomeMessage } from './components'
import { useUsersStore } from '@/stores/admin/user'
import { Shield, User as UserIcon, Users } from 'lucide-vue-next'

const usersStore = useUsersStore()

onMounted(async () => {
  await usersStore.fetchAllUsers()
})

const formatDate = (dateString) => {
  if (!dateString) return 'Belum pernah login'
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
