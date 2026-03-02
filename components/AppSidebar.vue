<script setup lang="ts">
import { LayoutDashboard, Bike, LogOut } from 'lucide-vue-next'
import logoSrc from '~/assets/images/logo.svg'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '~/composables/useAuth'
import { useDashboard } from '~/composables/useDashboard'
import { useFleet } from '~/composables/useFleet'

const route = useRoute()
const router = useRouter()
const { logout } = useAuth()
const { clearDashboard } = useDashboard()
const { clearFleet } = useFleet()

const isActive = (path: string) => route.path === path

const handleLogout = async () => {
  clearDashboard()
  clearFleet()
  await logout()
  router.push('/login')
}
</script>

<template>
  <aside
    class="fixed left-0 top-0 h-full w-24 hidden lg:flex flex-col items-center py-10 border-r border-slate-800/60 bg-slate-950/80 backdrop-blur-2xl z-50"
  >
    <RouterLink
      to="/"
      class="w-14 h-14 rounded-2xl flex items-center justify-center mb-16 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-105 transition-transform overflow-hidden"
    >
      <img :src="logoSrc" alt="84 Capital" class="w-full h-full object-cover" />
    </RouterLink>

    <nav class="flex flex-col gap-10 flex-1 w-full px-4">
      <RouterLink
        to="/"
        class="p-4 rounded-2xl transition-all relative group flex justify-center w-full"
        :class="isActive('/') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-600 hover:text-white'"
      >
        <LayoutDashboard class="w-6 h-6" />
        <span
          class="absolute left-full ml-6 px-2.5 py-1.5 bg-slate-800 text-[10px] text-white rounded-lg font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tracking-widest border border-slate-700 shadow-xl z-50"
        >
          Dashboard
        </span>
      </RouterLink>

      <RouterLink
        to="/fleet"
        class="p-4 rounded-2xl transition-all relative group flex justify-center w-full"
        :class="
          isActive('/fleet') ? 'text-blue-400 bg-blue-500/10' : 'text-slate-600 hover:text-white'
        "
      >
        <Bike class="w-6 h-6" />
        <span
          class="absolute left-full ml-6 px-2.5 py-1.5 bg-slate-800 text-[10px] text-white rounded-lg font-black uppercase opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap tracking-widest border border-slate-700 shadow-xl z-50"
        >
          Frota
        </span>
      </RouterLink>
    </nav>

    <button
      class="p-4 text-slate-700 hover:text-rose-400 transition-all mt-auto mb-4"
      @click="handleLogout"
    >
      <LogOut class="w-6 h-6" />
    </button>
  </aside>
</template>
