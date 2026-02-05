<script setup lang="ts">
import { Bike } from 'lucide-vue-next'
import type { Moto } from '~/types'

interface Props {
  motos: Moto[]
}

const props = defineProps<Props>()

const { calculatePercentage, formatCurrency } = useMotoData()
</script>

<template>
  <div class="glass-panel rounded-2xl p-5 md:p-6">
    <div class="flex items-center justify-between mb-6">
      <h3
        class="text-slate-400 font-semibold text-sm flex items-center gap-2 tracking-wide uppercase"
      >
        <Bike class="text-blue-500 w-4 h-4" />
        Rendimento por Moto
      </h3>
    </div>
    <div class="space-y-6">
      <div v-for="moto in props.motos" :key="moto.id">
        <div class="flex justify-between items-end mb-2">
          <span
            class="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded-md tracking-widest border border-slate-700"
          >
            {{ moto.plate }}
          </span>
          <span class="text-sm font-bold text-blue-400">
            R$ {{ formatCurrency(moto.received) }}
          </span>
        </div>
        <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
            :style="{
              width: `${calculatePercentage(moto.received, moto.target)}%`,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
