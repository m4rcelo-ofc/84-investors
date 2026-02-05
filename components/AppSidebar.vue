<script setup lang="ts">
import { LayoutDashboard, Bike, LogOut } from 'lucide-vue-next'

interface Props {
  currentView: 'dashboard' | 'frota'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'switch-view': [view: 'dashboard' | 'frota']
  logout: []
}>()

const isActive = (view: string) => props.currentView === view
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full w-24 hidden lg:flex flex-col items-center py-10 border-r border-slate-800/60 bg-slate-950/80 backdrop-blur-2xl z-50"
  >
    <div
      class="w-14 h-14 rounded-2xl flex items-center justify-center mb-16 shadow-[0_0_30px_rgba(59,130,246,0.3)] cursor-pointer hover:scale-105 transition-transform overflow-hidden"
      @click="emit('switch-view', 'dashboard')"
    >
      <img src="~/assets/images/logo.svg" alt="84 Capital" class="w-full h-full object-cover" />
    </div>

    <nav class="flex flex-col gap-10 flex-1 w-full px-4">
      <button
        class="p-4 rounded-2xl transition-all relative group flex justify-center w-full"
        :class="
          isActive('dashboard')
            ? 'text-blue-400 bg-blue-500/10'
            : 'text-slate-600 hover:text-white'
        "
        @click="emit('switch-view', 'dashboard')"
      >
        <LayoutDashboard class="w-6 h-6" />
        <!-- Tooltip -->
        <span
          class="absolute left-full ml-6 px-2.5 py-1.5 bg-slate-800 text-[10px] text-white rounded-lg font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tracking-widest border border-slate-700 shadow-xl z-50"
        >
          Dashboard
        </span>
      </button>

      <button
        class="p-4 rounded-2xl transition-all relative group flex justify-center w-full"
        :class="
          isActive('frota')
            ? 'text-blue-400 bg-blue-500/10'
            : 'text-slate-600 hover:text-white'
        "
        @click="emit('switch-view', 'frota')"
      >
        <Bike class="w-6 h-6" />
        <!-- Tooltip -->
        <span
          class="absolute left-full ml-6 px-2.5 py-1.5 bg-slate-800 text-[10px] text-white rounded-lg font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tracking-widest border border-slate-700 shadow-xl z-50"
        >
          Frota
        </span>
      </button>
    </nav>

    <button
      class="p-4 text-slate-700 hover:text-rose-400 transition-all mt-auto mb-4"
      @click="emit('logout')"
    >
      <LogOut class="w-6 h-6" />
    </button>
  </aside>
</template>
