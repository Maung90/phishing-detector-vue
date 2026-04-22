<script setup>
const props = defineProps({
  name: String,
  message :String
})

</script>
<template>
  <div class="mb-8 fade-in">
    <h2 class="text-3xl font-bold text-black mb-2">
      Welcome, {{ name || "Developer" }}
    </h2>
    <p class="text-black/60">
      {{ message || " "}}
    </p>
  </div>
  </template>
