<script setup lang="ts">
import { Bike } from 'lucide-vue-next'

interface PlateRevenue {
  plate: string
  received: number
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
        Rendimento por Veículo
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
        <span class="text-sm font-bold text-blue-400">
          R$ {{ formatCurrency(vehicle.received) }}
        </span>
      </div>
    </div>
  </div>
</template>
