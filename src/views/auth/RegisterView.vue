<template>
  <div class="min-h-screen font-sans flex items-center justify-center p-5 relative overflow-hidden"
    style="background-color:#f4f7ff; background-image:radial-gradient(ellipse at 20% 0%, #dce8ff 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, #e0e9ff 0%, transparent 50%);">

    <!-- Background blobs -->
    <div class="absolute top-0 left-0 w-80 h-80 rounded-full pointer-events-none"
      style="background:rgba(44,99,209,0.07); filter:blur(60px); transform:translate(-30%, -30%);"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
      style="background:rgba(44,99,209,0.05); filter:blur(80px); transform:translate(30%, 30%);"></div>

    <div class="w-full max-w-sm relative z-10 anim-fade-up">

      <!-- Brand -->
      <div class="flex flex-col items-center mb-8">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style="background:#2c63d1; box-shadow:0 6px 20px rgba(44,99,209,0.4);">
          <Shield class="w-8 h-8 text-white" />
        </div>
        <h1 class="text-3xl font-extrabold tracking-tight mb-1" style="color:#0f1b3d;">SEQR</h1>
        <p class="text-xs font-mono" style="color:#6b7fa3;">Advanced Quishing Detection Platform</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border overflow-hidden"
        style="background:#ffffff; border-color:rgba(44,99,209,0.1); box-shadow:0 4px 40px rgba(44,99,209,0.1);">

        <!-- Card header strip -->
        <div class="px-7 pt-7 pb-5 border-b" style="border-color:rgba(44,99,209,0.08);">
          <h2 class="text-xl font-extrabold tracking-tight" style="color:#0f1b3d;">Selamat Datang</h2>
          <p class="text-xs mt-1" style="color:#6b7fa3;">Daftar dengan kami untuk membangun sistem pendeteksi ancaman quishing</p>
        </div>

        <!-- Form -->
        <div class="px-7 py-6">
          <form @submit.prevent="handleRegister" class="flex flex-col gap-4">

          <!-- Name Input -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold" style="color:#4a5878;">Username</label>
            <div class="relative">
              <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color:#9baac5;" />
              <input
                v-model="username"
                type="text"
                placeholder="John Doe"
                required
                class="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style="background:#f4f7ff; color:#0f1b3d; border-color:rgba(44,99,209,0.18); font-family:inherit;"
                  @focus="e => { e.target.style.borderColor='#2c63d1'; e.target.style.boxShadow='0 0 0 3px rgba(44,99,209,0.1)'; e.target.style.background='#ffffff'; }"
                  @blur="e => { e.target.style.borderColor='rgba(44,99,209,0.18)'; e.target.style.boxShadow='none'; e.target.style.background='#f4f7ff'; }"
              />
            </div>
          </div>

            <!-- Email -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold" style="color:#4a5878;">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color:#9baac5;" />
                <input
                  v-model="email" type="text" required placeholder="your@email.com"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style="background:#f4f7ff; color:#0f1b3d; border-color:rgba(44,99,209,0.18); font-family:inherit;"
                  @focus="e => { e.target.style.borderColor='#2c63d1'; e.target.style.boxShadow='0 0 0 3px rgba(44,99,209,0.1)'; e.target.style.background='#ffffff'; }"
                  @blur="e => { e.target.style.borderColor='rgba(44,99,209,0.18)'; e.target.style.boxShadow='none'; e.target.style.background='#f4f7ff'; }" />
              </div>
            </div>

            <!-- Password -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold" style="color:#4a5878;">Password</label>
              <div class="relative">
                <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style="color:#9baac5;" />
                <input
                  v-model="password" type="password" required placeholder="••••••••"
                  class="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-all"
                  style="background:#f4f7ff; color:#0f1b3d; border-color:rgba(44,99,209,0.18); font-family:inherit;"
                  @focus="e => { e.target.style.borderColor='#2c63d1'; e.target.style.boxShadow='0 0 0 3px rgba(44,99,209,0.1)'; e.target.style.background='#ffffff'; }"
                  @blur="e => { e.target.style.borderColor='rgba(44,99,209,0.18)'; e.target.style.boxShadow='none'; e.target.style.background='#f4f7ff'; }" />
              </div>
            </div>

            <!-- Error -->
            <div v-if="errorMessage" class="flex items-start gap-2.5 px-3.5 py-3 rounded-xl border"
              style="background:rgba(220,38,38,0.06); border-color:rgba(220,38,38,0.2);">
              <AlertCircle class="w-4 h-4 shrink-0 mt-0.5" style="color:#dc2626;" />
              <p class="text-xs font-medium" style="color:#dc2626;">{{ errorMessage }}</p>
            </div>

            <!-- Submit -->
            <button type="submit" :disabled="loading"
              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 mt-1"
              style="background:#2c63d1;"
              @mouseenter="e => !loading && (e.currentTarget.style.boxShadow='0 4px 16px rgba(44,99,209,0.4)')"
              @mouseleave="e => e.currentTarget.style.boxShadow='none'">
              <LogIn v-if="!loading" class="w-4 h-4" />
              <div v-else class="spinner spinner-sm"></div>
              <span>{{ loading ? 'Authenticating...' : 'Sign Up' }}</span>
            </button>

          </form>
        </div>

        <!-- Footer -->
        <div class="px-7 pb-6 text-center">
          <p class="text-xs" style="color:#9baac5;">
            Sudah punya akun?
            <RouterLink to="/login" class="font-semibold transition-colors" style="color:#2c63d1;">
              Masuk
            </RouterLink>
          </p>
        </div>

      </div>

      <!-- Bottom note -->
      <p class="text-center text-xs mt-5" style="color:#b0bdd6;">
        &copy; 2026 SEQR · Sistem Deteksi Quishing
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Shield, Mail, Lock, LogIn, AlertCircle, User} from 'lucide-vue-next'

const router    = useRouter()
const authStore = useAuthStore()

const email        = ref('')
const username     = ref('')
const password     = ref('')
const loading      = ref(false)
const errorMessage = ref('')


const handleRegister = async () => {
  loading.value = true
  errorMessage.value = ''

  const result = await authStore.register(username.value, email.value, password.value)

  if (result.success) {
    router.push('developer')
  } else {
    errorMessage.value = result.error
  }

  loading.value = false
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.font-sans { font-family: 'Plus Jakarta Sans', sans-serif; }
.font-mono { font-family: 'JetBrains Mono', monospace; }

.spinner    { width:28px; height:28px; border-radius:50%; border:3px solid rgba(255,255,255,0.25); border-top-color:#ffffff; animation:spin .7s linear infinite; }
.spinner-sm { width:16px; height:16px; border-width:2px; }

.anim-fade-up { animation:fadeUp .45s ease both; }
.anim-pulse   { animation:pulse 2s ease-in-out infinite; }

@keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes spin   { to{transform:rotate(360deg)} }
@keyframes pulse  { 0%,100%{opacity:1} 50%{opacity:.35} }
</style>
