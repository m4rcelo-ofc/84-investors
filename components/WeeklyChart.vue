<script setup lang="ts">
import { computed } from 'vue'
import { History } from 'lucide-vue-next'
import type { WeeklyData } from '~/types'

interface Props {
  data: WeeklyData[]
  totalRevenue?: number
  comparativeRevenue?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalRevenue: 0,
  comparativeRevenue: 0,
})

const chartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 200,
    toolbar: { show: false },
    background: 'transparent',
  },
  colors: ['#3b82f6'],
  plotOptions: {
    bar: { borderRadius: 4, columnWidth: '40%' },
  },
  dataLabels: { enabled: false },
  xaxis: {
    categories: props.data.map((d) => d.x),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#64748b', fontSize: '10px' } },
  },
  yaxis: { show: false },
  grid: { show: false },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val: number) =>
        `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
  },
}))

const series = computed(() => [{ name: 'Valor', data: props.data.map((d) => d.y) }])

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
</script>

<template>
  <div class="glass-panel rounded-2xl p-5 md:p-6 h-full">
    <div class="flex items-center justify-between mb-6">
      <h3
        class="text-slate-400 font-semibold text-sm flex items-center gap-2 tracking-wide uppercase"
      >
        <History class="text-blue-500 w-4 h-4" />
        Fluxo Semanal
      </h3>
    </div>

    <div class="w-full h-[200px]">
      <apexchart type="bar" height="200" :options="chartOptions" :series="series" />
    </div>

    <div class="mt-8 pt-6 border-t border-slate-800/60 flex justify-between">
      <div>
        <p class="text-[10px] text-slate-500 font-black uppercase mb-1">Mês Atual</p>
        <p class="text-lg font-bold text-white tracking-tighter">
          R$ {{ formatCurrency(totalRevenue) }}
        </p>
      </div>
      <div class="text-right">
        <p class="text-[10px] text-slate-500 font-black uppercase mb-1">Mês Anterior</p>
        <p class="text-lg font-bold text-blue-400 tracking-tighter">
          R$ {{ formatCurrency(comparativeRevenue) }}
        </p>
      </div>
    </div>
  </div>
</template>
