<script setup>
import { Brain } from "lucide-vue-next"

const props = defineProps({
  models: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="glass-effect rounded-2xl p-8 shadow-2xl">

    <!-- Title -->
    <h3 class="text-xl font-bold text-black mb-6 flex items-center gap-2">
      <Brain class="w-6 h-6 text-black" />
      Active ML Models
    </h3>

    <!-- List -->
    <div class="space-y-4">
      <div
        v-for="model in models"
        :key="model.id"
        class="p-4 bg-[#2c63d1]/50 rounded-lg border border-black/30 my-3"
      >
        <div class="flex items-start justify-between mb-2">

          <div>
            <h4 class="font-semibold text-[#fafcfc]">
              {{ model.name }}
            </h4>
            <p class="text-sm text-black/40">
              {{ model.type }}
            </p>
          </div>

          <span class="text-xs font-semibold px-2 py-1 rounded text-black">
            {{ model.accuracy }}% accuracy
          </span>

        </div>
      </div>
    </div>

        <RouterLink
        to="/admin/models"
        class="mt-4 text-black hover:text-black/30 text-sm font-semibold flex items-center gap-2"
        >
        Manage Models
        <ArrowRight class="w-4 h-4" />
      </RouterLink>
  </div>
</template>
