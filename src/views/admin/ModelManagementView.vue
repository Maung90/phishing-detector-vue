<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="glass-effect border-b border-slate-700/50 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-danger-500 to-danger-700 flex items-center justify-center">
              <Shield class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-xl font-bold text-white">SEQR Admin</h1>
              <p class="text-xs text-slate-400 font-mono">System Management</p>
            </div>
          </div>
          <button
            @click="handleLogout"
            class="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut class="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="glass-effect border-b border-slate-700/50">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex gap-1 overflow-x-auto">
          <RouterLink to="/admin" :class="navClass('/admin')">
            <div class="flex items-center gap-2">
              <LayoutDashboard class="w-4 h-4" />
              <span class="hidden sm:inline">Dashboard</span>
            </div>
          </RouterLink>
          <RouterLink to="/admin/models" :class="navClass('/admin/models')">
            <div class="flex items-center gap-2">
              <Brain class="w-4 h-4" />
              <span class="hidden sm:inline">Models</span>
            </div>
          </RouterLink>
          <RouterLink to="/admin/feedback" :class="navClass('/admin/feedback')">
            <div class="flex items-center gap-2">
              <MessageSquare class="w-4 h-4" />
              <span class="hidden sm:inline">Feedback</span>
            </div>
          </RouterLink>
          <RouterLink to="/admin/history" :class="navClass('/admin/history')">
            <div class="flex items-center gap-2">
              <History class="w-4 h-4" />
              <span class="hidden sm:inline">History</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 fade-in">
        <div>
          <h2 class="text-3xl font-bold text-white mb-2">ML Model Management</h2>
          <p class="text-slate-400">Manage detection models and algorithms</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-danger-500/30"
        >
          <Plus class="w-5 h-5" />
          Add New Model
        </button>
      </div>

      <!-- Models Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 fade-in">
        <div
          v-for="model in adminStore.mlModels"
          :key="model.id"
          class="glass-effect rounded-2xl p-6 shadow-2xl border border-slate-700/50"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-xl font-bold text-white">{{ model.name }}</h3>
                <span
                  :class="[
                    'text-xs font-semibold px-2 py-1 rounded',
                    model.status === 'active'
                      ? 'bg-safe-500/20 text-safe-400'
                      : 'bg-slate-500/20 text-slate-400'
                  ]"
                >
                  {{ model.status }}
                </span>
              </div>
              <p class="text-sm text-slate-400">{{ model.type }}</p>
            </div>
            <button
              @click="confirmDelete(model)"
              class="p-2 hover:bg-danger-500/20 rounded-lg transition-colors group"
              title="Delete model"
            >
              <Trash2 class="w-5 h-5 text-slate-400 group-hover:text-danger-400" />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-4">
            <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p class="text-xs text-slate-500 mb-1">Accuracy</p>
              <p class="text-2xl font-bold text-white">{{ model.accuracy }}%</p>
            </div>
            <div class="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p class="text-xs text-slate-500 mb-1">Version</p>
              <p class="text-2xl font-bold text-white font-mono">{{ model.version }}</p>
            </div>
          </div>

          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Training Samples</span>
              <span class="text-white font-mono">{{ model.trainedSamples.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-400">Created</span>
              <span class="text-white">{{ formatDate(model.createdAt) }}</span>
            </div>
          </div>

          <button
            @click="adminStore.toggleModelStatus(model.id)"
            :class="[
              'w-full py-2 font-semibold rounded-lg transition-all',
              model.status === 'active'
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-safe-500 hover:bg-safe-600 text-white'
            ]"
          >
            {{ model.status === 'active' ? 'Deactivate' : 'Activate' }}
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="adminStore.mlModels.length === 0" class="glass-effect rounded-2xl p-16 text-center shadow-2xl fade-in">
        <Brain class="w-20 h-20 text-slate-600 mx-auto mb-4" />
        <h3 class="text-2xl font-bold text-white mb-2">No Models Yet</h3>
        <p class="text-slate-400 mb-6">Create your first ML model to start detecting threats</p>
        <button
          @click="showCreateModal = true"
          class="px-6 py-3 bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white font-semibold rounded-lg transition-all inline-flex items-center gap-2"
        >
          <Plus class="w-5 h-5" />
          Add New Model
        </button>
      </div>
    </div>

    <!-- Create Model Modal -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in"
      @click.self="showCreateModal = false"
    >
      <div class="glass-effect rounded-2xl p-8 max-w-lg w-full shadow-2xl">
        <h3 class="text-2xl font-bold text-white mb-6">Create New Model</h3>

        <form @submit.prevent="createModel" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Model Name
            </label>
            <input
              v-model="newModel.name"
              type="text"
              required
              placeholder="e.g., Random Forest Classifier v3.0"
              class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-transparent text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Model Type
            </label>
            <select
              v-model="newModel.type"
              required
              class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-transparent text-white"
            >
              <option value="">Select type</option>
              <option value="Random Forest">Random Forest</option>
              <option value="Deep Learning">Deep Learning</option>
              <option value="Support Vector Machine">Support Vector Machine</option>
              <option value="Naive Bayes">Naive Bayes</option>
              <option value="Gradient Boosting">Gradient Boosting</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Accuracy (%)
            </label>
            <input
              v-model.number="newModel.accuracy"
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 95.5"
              class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-transparent text-white placeholder-slate-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-300 mb-2">
              Training Samples
            </label>
            <input
              v-model.number="newModel.trainedSamples"
              type="number"
              min="0"
              placeholder="e.g., 100000"
              class="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-danger-500 focus:border-transparent text-white placeholder-slate-500"
            />
          </div>

          <div class="flex gap-3">
            <button
              type="button"
              @click="showCreateModal = false"
              class="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="creating"
              class="flex-1 py-3 bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="!creating">Create Model</span>
              <span v-else class="loading-dots">Creating</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 fade-in"
      @click.self="showDeleteModal = false"
    >
      <div class="glass-effect rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-full bg-danger-500/20 flex items-center justify-center">
            <AlertTriangle class="w-6 h-6 text-danger-400" />
          </div>
          <h3 class="text-2xl font-bold text-white">Delete Model?</h3>
        </div>

        <p class="text-slate-300 mb-6">
          Are you sure you want to delete <strong class="text-white">{{ modelToDelete?.name }}</strong>?
          This action cannot be undone.
        </p>

        <div class="flex gap-3">
          <button
            @click="showDeleteModal = false"
            class="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            @click="deleteModel"
            :disabled="deleting"
            class="flex-1 py-3 bg-gradient-to-r from-danger-500 to-danger-600 hover:from-danger-600 hover:to-danger-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!deleting">Delete</span>
            <span v-else class="loading-dots">Deleting</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAdminStore } from '@/stores/admin'
import {
  Shield, LogOut, LayoutDashboard, Brain, MessageSquare, History,
  Plus, Trash2, AlertTriangle
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const adminStore = useAdminStore()

const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const creating = ref(false)
const deleting = ref(false)
const modelToDelete = ref(null)

const newModel = reactive({
  name: '',
  type: '',
  accuracy: null,
  trainedSamples: null
})

const navClass = (path) => {
  return [
    'px-4 py-3 font-medium transition-all whitespace-nowrap',
    route.path === path
      ? 'text-danger-400 border-b-2 border-danger-400'
      : 'text-slate-400 hover:text-white'
  ]
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const createModel = async () => {
  creating.value = true
  await adminStore.createModel(newModel)
  showCreateModal.value = false

  // Reset form
  newModel.name = ''
  newModel.type = ''
  newModel.accuracy = null
  newModel.trainedSamples = null

  creating.value = false
}

const confirmDelete = (model) => {
  modelToDelete.value = model
  showDeleteModal.value = true
}

const deleteModel = async () => {
  deleting.value = true
  await adminStore.deleteModel(modelToDelete.value.id)
  showDeleteModal.value = false
  modelToDelete.value = null
  deleting.value = false
}
</script>
