<script setup>
import {
  Key, Activity, Zap,
  TrendingUp, BarChart3, Plus, FileText
} from 'lucide-vue-next'
</script>
<template>
  <div class="glass-effect rounded-2xl p-8 shadow-2xl fade-in bg-[#2c63d1]/5 border border-[#2c63d1]/10">
    <h3 class="text-xl font-bold text-[#2c63d1] mb-6">Aksi Cepat</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <RouterLink
      to="/admin/models"
      class="p-6 bg-[#2c63d1]/50 hover:bg-[#2c63d1]/10 border border-[#2c63d1]/10 rounded-xl transition-all group"
      >
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-lg bg-[#fafcfc]/10 flex items-center justify-center group-hover:bg-[#fafcfc]/20 transition-colors">
          <Plus class="w-6 h-6 text-[#fafcfc]" />
        </div>
        <div>
          <h4 class="font-semibold text-[#fafcfc] mb-1">Buat Model</h4>
          <p class="text-sm text-[#fafcfc]/60">Tambahkan model baru</p>
        </div>
      </div>
    </RouterLink>

    <RouterLink
    to="/admin/feedback"
    class="p-6 bg-[#2c63d1]/50 hover:bg-[#2c63d1]/10 border border-[#2c63d1]/10 rounded-xl transition-all group"
    >
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-lg bg-[#fafcfc]/10 flex items-center justify-center group-hover:bg-[#fafcfc]/20 transition-colors">
        <Plus class="w-6 h-6 text-[#fafcfc]" />
      </div>
      <div>
        <h4 class="font-semibold text-[#fafcfc] mb-1">Lihat Feedback</h4>
        <p class="text-sm text-[#fafcfc]/60">Feedback User</p>
      </div>
    </div>
  </RouterLink>

  <RouterLink
  to="/admin/feedback"
  class="p-6 bg-[#2c63d1]/50 hover:bg-[#2c63d1]/10 border border-[#2c63d1]/10 rounded-xl transition-all group"
  >
  <div class="flex items-start gap-4">
    <div class="w-12 h-12 rounded-lg bg-[#fafcfc]/10 flex items-center justify-center group-hover:bg-[#fafcfc]/20 transition-colors">
      <Plus class="w-6 h-6 text-[#fafcfc]" />
    </div>
    <div>
      <h4 class="font-semibold text-[#fafcfc] mb-1">Riwayat Scan</h4>
      <p class="text-sm text-[#fafcfc]/60">Semua Deteksi</p>
    </div>
  </div>
</RouterLink>

<button
class="p-6 bg-[#2c63d1]/50 hover:bg-[#2c63d1] border border-[#2c63d1] rounded-xl transition-all group text-center"
>
<div class="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors mx-auto mb-3">
  <Download class="w-6 h-6 text-green-400" />
</div>
<h4 class="font-semibold text-white mb-1">Export Data</h4>
<p class="text-xs text-[#2c63d1]">Generate reports</p>
</button>
</div>
</div>
</template>
