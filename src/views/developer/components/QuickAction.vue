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
      to="/developer/keys"
      class="p-6 bg-[#2c63d1]/50 hover:bg-[#2c63d1]/10 border border-[#2c63d1]/10 rounded-xl transition-all group"
      >
      <div class="flex items-start gap-4">
        <div class="w-12 h-12 rounded-lg bg-[#fafcfc]/10 flex items-center justify-center group-hover:bg-[#fafcfc]/20 transition-colors">
          <Plus class="w-6 h-6 text-[#fafcfc]" />
        </div>
        <div>
          <h4 class="font-semibold text-[#fafcfc] mb-1">Buat Kunci API Baru</h4>
          <p class="text-sm text-[#fafcfc]/60">Buat kunci baru untuk aplikasi Anda</p>
        </div>
      </div>
    </RouterLink>

    <a
    href="https://docs.seqr.com"
    target="_blank"
    class="p-6 bg-[#2c63d1]/50 hover:bg-[#2c63d1]/10 border border-[#2c63d1]/10 rounded-xl transition-all group"
    >
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-lg bg-[#fafcfc]/20 flex items-center justify-center group-hover:bg-[#fafcfc]/20 transition-colors">
        <FileText class="w-6 h-6 text-[#fafcfc]" />
      </div>
      <div>
        <h4 class="font-semibold text-[#fafcfc] mb-1">Dokumentasi API</h4>
        <p class="text-sm text-[#fafcfc]/60">Pelajari cara mengintegrasikan API SEQR</p>
      </div>
    </div>
  </a>
</div>
</div>
</template>
