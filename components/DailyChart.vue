<script setup lang="ts">
import { TrendingUp } from 'lucide-vue-next'
import type { DailyData } from '~/types'

interface Props {
  data: DailyData[]
  totalRevenue?: number
  comparativeRevenue?: number
}

const props = withDefaults(defineProps<Props>(), {
  totalRevenue: 0,
  comparativeRevenue: 0,
})

// Calcular variação percentual
const revenueChange = computed(() => {
  if (!props.comparativeRevenue || props.comparativeRevenue === 0) return 0
  return ((props.totalRevenue - props.comparativeRevenue) / props.comparativeRevenue) * 100
})

const revenueChangeFormatted = computed(() => {
  const value = revenueChange.value
  const sign = value >= 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
})

const revenueDifference = computed(() => {
  return props.totalRevenue - props.comparativeRevenue
})

const chartOptions = computed(() => ({
  chart: {
    type: 'area',
    height: 320,
    fontFamily: 'Inter, sans-serif',
    toolbar: { show: false },
    background: 'transparent',
  },
  colors: ['#3b82f6'],
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.05,
      stops: [0, 90, 100],
    },
  },
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  xaxis: {
    categories: props.data.map(d => d.day),
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: { style: { colors: '#64748b', fontSize: '10px' } },
  },
  yaxis: {
    labels: {
      style: { colors: '#64748b', fontSize: '10px' },
      formatter: (value: number) => `R$${value}`,
    },
  },
  grid: {
    borderColor: '#1e293b',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
  },
  theme: { mode: 'dark' },
  tooltip: { theme: 'dark' },
}))

const series = computed(() => [
  {
    name: 'Recebimentos',
    data: props.data.map(d => d.valor),
  },
])

// Formatar valor em reais
const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
</script>

<template>
  <div class="glass-panel rounded-2xl p-5 md:p-6">
    <div class="flex items-center justify-between mb-6">
      <h3
        class="text-slate-400 font-semibold text-sm flex items-center gap-2 tracking-wide uppercase"
      >
        <TrendingUp class="text-blue-500 w-4 h-4" />
        Desempenho Diário do Ciclo
      </h3>
    </div>

    <!-- ApexChart Container -->
    <ClientOnly>
      <apexchart
        type="area"
        height="320"
        :options="chartOptions"
        :series="series"
      />
    </ClientOnly>

    <div
      class="mt-6 flex flex-col md:flex-row items-start md:items-center justify-between p-5 bg-slate-950/40 rounded-2xl border border-slate-800/60"
    >
      <div>
        <span
          class="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1 block"
        >
          Total Consolidado (Ciclo)
        </span>
        <div class="flex items-baseline gap-2">
          <span class="text-2xl font-bold text-white">R$ {{ formatCurrency(totalRevenue) }}</span>
          <span
            class="text-sm font-bold"
            :class="revenueChange >= 0 ? 'text-blue-400' : 'text-red-400'"
          >
            {{ revenueChangeFormatted }}
          </span>
        </div>
      </div>
      <div
        class="mt-4 md:mt-0 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl max-w-sm"
      >
        <p class="text-[9px] text-blue-500 font-bold uppercase tracking-wider">
          Comparativo vs Ciclo Anterior
        </p>
        <p class="text-xs text-slate-400 mt-1">
          <template v-if="revenueDifference >= 0">
            Crescimento de R$ {{ formatCurrency(revenueDifference) }} em relação ao período passado.
          </template>
          <template v-else>
            Redução de R$ {{ formatCurrency(Math.abs(revenueDifference)) }} em relação ao período passado.
          </template>
        </p>
      </div>
    </div>
  </div>
</template>
