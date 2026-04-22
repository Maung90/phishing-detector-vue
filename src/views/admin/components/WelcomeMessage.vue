<script setup>
const props = defineProps({
  title: String,
  message :String
})
</script>
<template>
  <div class="mb-8 fade-in">
    <h2 class="text-3xl font-bold text-black mb-2">
      {{ title }}
    </h2>
    <p class="text-black/60">
      {{ message}}
    </p>
  </div>
  </template>
