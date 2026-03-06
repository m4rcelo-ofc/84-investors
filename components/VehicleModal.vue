<script setup lang="ts">
import { computed } from 'vue'
import { X, Camera, ShieldCheck } from 'lucide-vue-next'
import type { Vehicle } from '~/types'
import { useFleet } from '~/composables/useFleet'

interface Props {
  isOpen: boolean
  isAnimating: boolean
  vehicle: Vehicle | null
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

const { translateStatus } = useFleet()

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const storageBaseUrl = import.meta.env.VITE_API_URL.replace('/api/v1', '')

const imageUrl = computed(() =>
  props.vehicle?.image ? `${storageBaseUrl}/storage/${props.vehicle.image}` : null,
)

const displayStatus = computed(() => {
  if (!props.vehicle) return ''
  return translateStatus(props.vehicle.status)
})

const statusClasses = computed(() => {
  if (!props.vehicle) return ''
  switch (props.vehicle.status) {
    case 'rented':
      return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    case 'maintenance':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    case 'unavailable':
      return 'bg-red-500/10 text-red-400 border-red-500/20'
    case 'available':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }
})

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) emit('close')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
      :class="isAnimating ? 'opacity-100' : 'opacity-0'"
      @click="handleBackdropClick"
    >
      <div
        class="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl transition-transform duration-300"
        :class="isAnimating ? 'scale-100' : 'scale-95'"
      >
        <button
          class="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          @click="emit('close')"
        >
          <X class="w-6 h-6" />
        </button>

        <template v-if="vehicle">
          <div class="flex items-center gap-4 mb-6">
            <div v-if="imageUrl" class="w-16 h-16 rounded-2xl overflow-hidden">
              <img :src="imageUrl" :alt="vehicle.model" class="w-full h-full object-cover" />
            </div>
            <div
              v-else
              class="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500"
            >
              <Camera class="w-8 h-8" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-white uppercase italic">
                {{ vehicle.brand }} {{ vehicle.model }}
              </h3>
              <p class="text-blue-500 text-xs font-mono font-bold tracking-widest mt-1">
                {{ vehicle.license_plate }}
              </p>
            </div>
          </div>

          <div class="mb-4">
            <span
              class="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border"
              :class="statusClasses"
            >
              {{ displayStatus }}
            </span>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <p class="text-[10px] text-slate-500 font-bold uppercase">Ano</p>
                <p class="text-white font-bold">{{ vehicle.year }}</p>
              </div>
              <div class="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <p class="text-[10px] text-slate-500 font-bold uppercase">Cor</p>
                <p class="text-white font-bold">{{ vehicle.color || 'N/A' }}</p>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div class="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <p class="text-[10px] text-slate-500 font-bold uppercase">Renavam</p>
                <p class="text-white font-bold font-mono text-sm">{{ vehicle.renavam }}</p>
              </div>
              <div class="p-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <p class="text-[10px] text-slate-500 font-bold uppercase">Chassi</p>
                <p class="text-white font-bold font-mono text-sm">{{ vehicle.chassi }}</p>
              </div>
            </div>

            <div class="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
              <div class="flex justify-between items-center mb-3">
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  A Receber
                </span>
                <span class="text-white font-bold">
                  {{ formatCurrency(vehicle.a_receber) }}
                </span>
              </div>
              <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-3">
                <div
                  class="h-full bg-blue-500 transition-all duration-500"
                  :style="{ width: `${vehicle.bar_pct}%` }"
                />
              </div>
              <div v-if="vehicle.insurance > 0" class="flex justify-between items-center pt-3 border-t border-slate-800">
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck class="w-3 h-3 text-rose-400" />
                  Seguro
                </span>
                <span class="text-rose-400 font-bold text-sm">
                  - {{ formatCurrency(vehicle.insurance) }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>
