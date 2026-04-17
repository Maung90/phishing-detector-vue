<script setup>
import { BarChart3 } from 'lucide-vue-next'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  max: {
    type: Number,
    default: 5000
  },
  title: {
    type: String,
    default: 'Penggunaan API (7 Hari Terakhir)'
  }
})
</script>

<template>
  <div class="glass-effect rounded-2xl p-8 shadow-2xl mb-8 fade-in bg-[#2c63d1]/5 border border-[#2c63d1]/10">

    <h3 class="text-xl font-bold text-[#2c63d1] mb-6 flex items-center gap-2">
      <BarChart3 class="w-6 h-6 text-secondary" />
      {{ title }}
    </h3>

    <div class="space-y-4">
      <div
        v-for="day in data"
        :key="day.day"
        class="flex items-center gap-4 m-1"
      >
        <div class="w-12 text-sm text-[#2c63d1]/60 font-mono">
          {{ day.day }}
        </div>

        <div class="flex-1 h-10 bg-[#2c63d1]/50 rounded-lg overflow-hidden relative border border-[#2c63d1]/5">
          <div
            class="h-full bg-[#fafcfc]/50 transition-all duration-500 flex items-center justify-end pr-3"
            :style="{ width: (day.requests / max * 100) + '%' }"
          >
            <span class="text-sm font-bold text-black/20">
              {{ day.requests.toLocaleString() }}
            </span>
          </div>
        </div>

      </div>
    </div>

  </div>
</template>
