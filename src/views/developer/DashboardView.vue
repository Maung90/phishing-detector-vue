<template>
  <div class="min-h-screen bg-primary">
    <Header />
    <Navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Welcome -->
      <!-- <WelcomeMessage message="Pantau penggunaan API Anda dan kelola kunci akses" :name="authStore.user?.name || null"/> -->

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 fade-in">
<!--
        <StatCard
        v-for="(card, index) in statCards"
        :key="index"
        :title="card.title"
        :value="card.value"
        :icon="card.icon"
        :color="card.color"
        /> -->
      </div>
      <!-- <UsageChart
      :data="usageData"
      :max="5000"
      title="Penggunaan API (7 Hari Terakhir)"
      /> -->
    <!-- <QuickAction /> -->
  </div>
</div>
</template>

<script setup>
import { Header, Navbar, WelcomeMessage, StatCard, QuickAction, UsageChart } from './components'

</script>
