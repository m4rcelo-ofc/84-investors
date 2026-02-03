<script setup lang="ts">
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

const emit = defineEmits<{
  login: [email: string, password: string]
}>()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Preencha todos os campos'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  emit('login', email.value, password.value)
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Expor método para receber erro do componente pai
defineExpose({
  setError: (error: string) => {
    errorMessage.value = error
    isLoading.value = false
  },
  setLoading: (loading: boolean) => {
    isLoading.value = loading
  }
})
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950 transition-opacity duration-500"
  >
    <!-- Background Decor -->
    <div
      class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"
    />
    <div
      class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow pointer-events-none"
      style="animation-delay: 2s"
    />

    <div class="w-full max-w-md z-10 animate-fade-in">
      <div class="text-center mb-10">
        <div
          class="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center text-slate-950 font-black text-3xl mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.4)]"
        >
          84
        </div>
        <h1 class="text-3xl font-bold text-white tracking-tight">84 Capital</h1>
        <p class="text-slate-500 mt-2">Gestão Inteligente de Ativos</p>
      </div>

      <div class="glass-panel rounded-3xl p-8 shadow-2xl">
        <form class="space-y-6" @submit.prevent="handleSubmit">
          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm text-center"
          >
            {{ errorMessage }}
          </div>

          <div class="space-y-2">
            <label
              class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
            >
              E-mail
            </label>
            <div class="relative">
              <Mail
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5"
              />
              <input
                v-model="email"
                type="email"
                placeholder="exemplo@email.com"
                :disabled="isLoading"
                class="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div class="space-y-2">
            <label
              class="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1"
            >
              Senha
            </label>
            <div class="relative">
              <Lock
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5"
              />
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                :disabled="isLoading"
                class="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-emerald-500/40 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                :disabled="isLoading"
                @click="togglePassword"
              >
                <Eye v-if="!showPassword" class="w-5 h-5" />
                <EyeOff v-else class="w-5 h-5" />
              </button>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            {{ isLoading ? 'Entrando...' : 'Entrar no Sistema' }}
          </button>
        </form>
      </div>
      <p
        class="text-center mt-8 text-slate-600 text-sm font-bold uppercase tracking-widest"
      >
        84 Capital © 2024
      </p>
    </div>
  </div>
</template>
