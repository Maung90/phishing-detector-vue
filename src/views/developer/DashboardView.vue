<template>
  <div class="min-h-screen bg-primary">
    <Header />
    <Navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <WelcomeMessage message="Pantau penggunaan API Anda dan kelola kunci akses" :name="Developer"/>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
      </div>
    <QuickAction />
  </div>
</div>
</template>

<script setup>
import { Header, Navbar, WelcomeMessage, QuickAction } from './components'

</script>
