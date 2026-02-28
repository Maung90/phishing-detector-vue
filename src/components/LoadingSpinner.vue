<template>
  <div class="flex flex-col items-center justify-center space-y-2">
    <Loader2 class="w-10 h-10 text-[#2563eb] animate-spin" />
    <p class="text-sm font-medium text-[#64748b]"><slot>Sedang memproses...</slot></p>
  </div>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next';
</script>
