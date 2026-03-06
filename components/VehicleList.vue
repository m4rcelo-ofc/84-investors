<script setup lang="ts">
import { Bike, ShieldCheck } from 'lucide-vue-next'

interface PlateRevenue {
  plate: string
  received: number
  insurance: number
}

interface Props {
  vehicles: PlateRevenue[]
}

const props = defineProps<Props>()

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>

<template>
  <div class="glass-panel rounded-2xl p-5 md:p-6">
    <div class="flex items-center justify-between mb-6">
      <h3
        class="text-slate-400 font-semibold text-sm flex items-center gap-2 tracking-wide uppercase"
      >
        <Bike class="text-blue-500 w-4 h-4" />
        A receber por veículo
      </h3>
    </div>
    <div class="space-y-3">
      <div
        v-for="vehicle in props.vehicles"
        :key="vehicle.plate"
        class="flex items-center justify-between p-3 bg-slate-800/10 rounded-2xl border border-slate-800/30"
      >
        <span
          class="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md tracking-widest border border-slate-700"
        >
          {{ vehicle.plate }}
        </span>
        <div class="flex items-center gap-3">
          <div v-if="vehicle.insurance > 0" class="relative group flex items-center gap-1 cursor-default">
            <ShieldCheck class="w-3.5 h-3.5 text-rose-400" />
            <span class="text-xs font-semibold text-rose-400">
              - R$ {{ formatCurrency(vehicle.insurance) }}
            </span>
            <div
              class="absolute bottom-full right-0 mb-2 px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10"
            >
              Seguro deduzido do repasse
            </div>
          </div>
          <span class="text-sm font-bold text-blue-400">
            R$ {{ formatCurrency(vehicle.received) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
