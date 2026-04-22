<script setup>
const props = defineProps({
  title: String,
  value: [String, Number],
  icon: Object,
  color: {
    type: String,
    default: '#2c63d1'
  },
  subtitle: String
})
</script>

<template>
  <div class="glass-effect rounded-xl p-6 border border-primary/10"
       :style="{ backgroundColor: color + '0D' }">

    <div class="flex items-center justify-between mb-4">
      <div
        class="w-12 h-12 rounded-lg flex items-center justify-center"
        :style="{ backgroundColor: color + '33' }"
      >
        <component :is="icon" class="w-6 h-6" :style="{ color }" />
      </div>
    </div>

    <div class="text-3xl font-bold mb-1" :style="{ color }">
      {{ value }}
    </div>

    <div class="text-sm" :style="{ color: color + '99' }">
      {{ title }}
    </div>

    <div v-if="subtitle" class="text-xs mt-1" :style="{ color: color + '66' }">
      {{ subtitle }}
    </div>
  </div>
</template>
