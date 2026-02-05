<script setup lang="ts">
import { Bike } from "lucide-vue-next";

interface Props {
  alugadas: number;
  manutencao: number;
  indisponiveis: number;
  disponiveis: number;
}

const props = defineProps<Props>();

const chartOptions = computed(() => ({
  chart: {
    type: "donut",
    height: 250,
    background: "transparent",
  },
  colors: ["#06b6d4", "#f59e0b", "#10b981", "#ef4444"],
  labels: ["Alugadas", "Manutenção", "Disponíveis", "Indisponíveis"],
  stroke: { show: false },
  dataLabels: { enabled: false },
  legend: { show: false },
  plotOptions: {
    pie: {
      donut: {
        size: "75%",
        labels: {
          show: true,
          name: { show: true, color: "#64748b", fontSize: "12px" },
          value: {
            show: true,
            color: "#fff",
            fontSize: "24px",
            fontWeight: 700,
          },
          total: {
            show: true,
            label: "Total",
            color: "#94a3b8",
            formatter: (w: { globals: { seriesTotals: number[] } }) => {
              return w.globals.seriesTotals
                .reduce((a, b) => a + b, 0)
                .toString();
            },
          },
        },
      },
    },
  },
  tooltip: { theme: "dark" },
}));

const series = computed(() => [
  props.alugadas,
  props.manutencao,
  props.disponiveis,
  props.indisponiveis,
]);
</script>

<template>
  <div class="glass-panel rounded-2xl p-5 md:p-6 flex flex-col h-full">
    <div class="flex items-center justify-between mb-6">
      <h3
        class="text-slate-400 font-semibold text-sm flex items-center gap-2 tracking-wide uppercase"
      >
        <Bike class="text-blue-500 w-4 h-4" />
        Eficiência Operacional
      </h3>
    </div>

    <div class="w-full h-[250px] flex justify-center items-center">
      <ClientOnly>
        <apexchart
          type="donut"
          height="250"
          :options="chartOptions"
          :series="series"
        />
      </ClientOnly>
    </div>

    <div class="space-y-3 mt-auto">
      <div
        class="flex items-center justify-between p-3.5 bg-slate-800/20 rounded-xl border border-slate-800/40"
      >
        <div class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-cyan-500" />
          <span
            class="text-xs font-semibold text-slate-300 tracking-wide uppercase"
          >
            Alugadas
          </span>
        </div>
        <span class="text-sm font-bold text-white">{{ alugadas }} motos</span>
      </div>
      <div
        class="flex items-center justify-between p-3.5 bg-slate-800/20 rounded-xl border border-slate-800/40"
      >
        <div class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span
            class="text-xs font-semibold text-slate-300 tracking-wide uppercase"
          >
            Manutenção
          </span>
        </div>
        <span class="text-sm font-bold text-white">{{ manutencao }} motos</span>
      </div>
      <div
        class="flex items-center justify-between p-3.5 bg-slate-800/20 rounded-xl border border-slate-800/40"
      >
        <div class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span
            class="text-xs font-semibold text-slate-300 tracking-wide uppercase"
          >
            Disponíveis
          </span>
        </div>
        <span class="text-sm font-bold text-white"
          >{{ disponiveis }} motos</span
        >
      </div>
      <div
        class="flex items-center justify-between p-3.5 bg-slate-800/20 rounded-xl border border-slate-800/40"
      >
        <div class="flex items-center gap-3">
          <div class="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span
            class="text-xs font-semibold text-slate-300 tracking-wide uppercase"
          >
            Indisponíveis
          </span>
        </div>
        <span class="text-sm font-bold text-white"
          >{{ indisponiveis }} motos</span
        >
      </div>
    </div>
  </div>
</template>
