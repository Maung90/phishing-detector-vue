<template>
  <div class="min-h-screen">

    <Header />
    <Navbar />
    <div class="max-w-7xl mx-auto px-4 py-8">
      <WelcomeMessage title="Dashboard Admin" message="Here’s a quick overview of your dashboard and recent activity."/>
      <QuickAction/>
    </div>
  </div>
  </template>

  <script setup>
  import { Header, Navbar, WelcomeMessage, QuickAction } from './components'
  </script>
