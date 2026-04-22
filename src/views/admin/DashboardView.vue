<template>
  <div class="min-h-screen font-sans">
    <Header />
    <Navbar />

    <div class="max-w-5xl mx-auto px-5 py-8 pb-24">
      <div class="mb-8 anim-fade-up">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-4"
          style="background:rgba(44,99,209,0.07); border-color:rgba(44,99,209,0.18); color:#2c63d1;">
          <span class="w-2 h-2 rounded-full anim-pulse" style="background:#2c63d1;"></span>
          Panel Admin
        </div>
        <WelcomeMessage title="Dashboard Admin" message="Berikut ringkasan aktivitas dan statistik sistem SEQR saat ini." />
      </div>

      <!-- ── LOADING ───────────────────────────────────────────── -->
      <div v-if="dashboardStore.isLoading" class="flex flex-col items-center justify-center py-24 gap-4 anim-fade-up">
        <div class="w-12 h-12 rounded-full border-4 spinner-blue"></div>
        <p class="text-sm font-mono" style="color:#6b7fa3;">Memuat data KPI dari server SEQR...</p>
      </div>

      <div v-else class="anim-fade-up">

        <!-- ── ERROR ─────────────────────────────────────────────── -->
        <div v-if="dashboardStore.error"
          class="flex items-start gap-3 px-4 py-3.5 rounded-2xl border mb-6"
          style="background:rgba(220,38,38,0.06); border-color:rgba(220,38,38,0.2);">
          <span class="text-sm font-semibold" style="color:#dc2626;">Error:</span>
          <span class="text-sm" style="color:#dc2626;">{{ dashboardStore.error }}</span>
        </div>

        <!-- ── KPI CARDS ──────────────────────────────────────────── -->
        <div v-if="dashboardStore.kpi" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

          <!-- Total Pemindaian -->
          <div class="rounded-2xl p-5 border flex flex-col gap-3"
            style="background:#ffffff; border-color:rgba(44,99,209,0.1); box-shadow:0 2px 16px rgba(44,99,209,0.06);">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              style="background:rgba(44,99,209,0.1);">
              <ScanLine class="w-5 h-5" style="color:#2c63d1;" />
            </div>
            <div>
              <div class="text-2xl font-extrabold tracking-tight" style="color:#0f1b3d;">
                {{ dashboardStore.kpi.total_detections.toLocaleString() }}
              </div>
              <div class="text-xs font-medium mt-0.5" style="color:#6b7fa3;">Total Pemindaian</div>
            </div>
            <div class="h-1 rounded-full w-full" style="background:rgba(44,99,209,0.12);">
              <div class="h-full rounded-full" style="background:#2c63d1; width:100%;"></div>
            </div>
          </div>

          <!-- Phishing Terdeteksi -->
          <div class="rounded-2xl p-5 border flex flex-col gap-3"
            style="background:#ffffff; border-color:rgba(220,38,38,0.15); box-shadow:0 2px 16px rgba(220,38,38,0.06);">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              style="background:rgba(220,38,38,0.1);">
              <ShieldAlert class="w-5 h-5" style="color:#dc2626;" />
            </div>
            <div>
              <div class="text-2xl font-extrabold tracking-tight" style="color:#dc2626;">
                {{ dashboardStore.kpi.phishing_detected.toLocaleString() }}
              </div>
              <div class="text-xs font-medium mt-0.5" style="color:#6b7fa3;">Phishing Terdeteksi</div>
            </div>
            <div class="h-1 rounded-full w-full" style="background:rgba(220,38,38,0.12);">
              <div class="h-full rounded-full" style="background:#dc2626;"
                :style="{ width: phishingRatio + '%' }"></div>
            </div>
          </div>

          <!-- Total Pengguna -->
          <div class="rounded-2xl p-5 border flex flex-col gap-3"
            style="background:#ffffff; border-color:rgba(44,99,209,0.1); box-shadow:0 2px 16px rgba(44,99,209,0.06);">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              style="background:rgba(44,99,209,0.1);">
              <Users class="w-5 h-5" style="color:#2c63d1;" />
            </div>
            <div>
              <div class="text-2xl font-extrabold tracking-tight" style="color:#0f1b3d;">
                {{ dashboardStore.kpi.total_users.toLocaleString() }}
              </div>
              <div class="text-xs font-medium mt-0.5" style="color:#6b7fa3;">Total Pengguna</div>
            </div>
            <div class="h-1 rounded-full w-full" style="background:rgba(44,99,209,0.12);">
              <div class="h-full rounded-full" style="background:#2c63d1; width:70%;"></div>
            </div>
          </div>

          <!-- Menunggu Ulasan -->
          <div class="rounded-2xl p-5 border flex flex-col gap-3"
            style="background:#ffffff; border-color:rgba(217,119,6,0.15); box-shadow:0 2px 16px rgba(217,119,6,0.06);">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              style="background:rgba(217,119,6,0.1);">
              <Clock class="w-5 h-5" style="color:#d97706;" />
            </div>
            <div>
              <div class="text-2xl font-extrabold tracking-tight" style="color:#d97706;">
                {{ dashboardStore.kpi.pending_reviews.toLocaleString() }}
              </div>
              <div class="text-xs font-medium mt-0.5" style="color:#6b7fa3;">Menunggu Ulasan</div>
            </div>
            <div class="h-1 rounded-full w-full" style="background:rgba(217,119,6,0.12);">
              <div class="h-full rounded-full" style="background:#d97706; width:45%;"></div>
            </div>
          </div>

        </div>

      </div>

      <!-- ── QUICK ACTIONS ─────────────────────────────────────── -->
      <div class="anim-fade-up-delay">
        <div class="flex items-center gap-2 mb-4">
          <Zap class="w-4 h-4" style="color:#2c63d1;" />
          <h3 class="text-sm font-bold" style="color:#0f1b3d;">Aksi Cepat</h3>
        </div>
        <QuickAction />
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminDashboardStore } from '@/stores/admin/dashboard'
import { Header, Navbar, WelcomeMessage, QuickAction } from './components'
import { ScanLine, ShieldAlert, Users, Clock, Zap } from 'lucide-vue-next'

const router         = useRouter()
const route          = useRoute()
const dashboardStore = useAdminDashboardStore()

const phishingRatio = computed(() => {
  const total    = dashboardStore.kpi?.total_detections || 0
  const phishing = dashboardStore.kpi?.phishing_detected || 0
  if (!total) return 0
  return Math.round((phishing / total) * 100)
})

onMounted(async () => {
  await dashboardStore.fetchAdminKpi()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.font-sans { font-family:'Plus Jakarta Sans', sans-serif; }
.font-mono { font-family:'JetBrains Mono', monospace; }

.spinner-blue {
  border-color: rgba(44,99,209,0.2);
  border-top-color: #2c63d1;
  animation: spin .7s linear infinite;
}

.anim-fade-up       { animation: fadeUp .45s ease both; }
.anim-fade-up-delay { animation: fadeUp .45s ease .1s both; }
.anim-pulse         { animation: pulse 2s ease-in-out infinite; }

@keyframes fadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin   { to{transform:rotate(360deg)} }
@keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
</style>
