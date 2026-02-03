<script setup lang="ts">
import { Camera, Info } from "lucide-vue-next";
import type { Vehicle } from "~/types";

interface Props {
  vehicle: Vehicle;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  "open-modal": [vehicle: Vehicle];
}>();

const { translateStatus } = useFleet();
const { formatCurrency } = useMotoData();

// Traduzir status para exibição
const displayStatus = computed(() => translateStatus(props.vehicle.status));

// Classes do status
const statusClasses = computed(() => {
  switch (props.vehicle.status) {
    case "rented":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "maintenance":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "unavailable":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "available":
      return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
});

// Cor da barra de progresso
const barColorClass = computed(() => {
  switch (props.vehicle.status) {
    case "rented":
      return "bg-emerald-500";
    case "maintenance":
      return "bg-amber-500";
    case "unavailable":
      return "bg-red-500";
    default:
      return "bg-indigo-500";
  }
});

// Calcular porcentagem de pagamento
const percentage = computed(() => {
  if (!props.vehicle.expected_amount || props.vehicle.expected_amount === 0) {
    return props.vehicle.paid_amount > 0 ? 100 : 0;
  }
  return Math.min(
    Math.round((props.vehicle.paid_amount / props.vehicle.expected_amount) * 100),
    100
  );
});

// URL da imagem
const imageUrl = computed(() => {
  if (props.vehicle.image) {
    return `http://localhost:8000/storage/${props.vehicle.image}`;
  }
  return null;
});
</script>

<template>
  <div
    class="glass-panel rounded-3xl overflow-hidden hover:border-emerald-500/40 transition-all duration-300 shadow-xl group"
  >
    <div class="p-6">
      <div class="flex justify-between items-start mb-6">
        <div class="flex gap-3">
          <div
            v-if="imageUrl"
            class="w-10 h-10 rounded-xl overflow-hidden shrink-0"
          >
            <img
              :src="imageUrl"
              :alt="vehicle.model"
              class="w-full h-full object-cover"
            />
          </div>
          <div
            v-else
            class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shrink-0"
          >
            <Camera class="w-5 h-5" />
          </div>
          <div>
            <h4
              class="text-white font-bold text-sm tracking-tight uppercase leading-snug"
            >
              {{ vehicle.brand }} {{ vehicle.model }}
            </h4>
            <p
              class="text-slate-500 text-[10px] font-mono tracking-[0.2em] uppercase mt-1.5 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 w-fit"
            >
              {{ vehicle.license_plate }}
            </p>
          </div>
        </div>
        <div
          class="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border"
          :class="statusClasses"
        >
          {{ displayStatus }}
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex justify-between items-end">
          <span
            class="text-[10px] font-black text-slate-500 uppercase tracking-widest"
          >
            Recebimento
          </span>
          <span class="text-base font-bold text-emerald-400">
            R$ {{ formatCurrency(vehicle.paid_amount) }}
          </span>
        </div>
        <div class="w-full h-2 bg-slate-800/60 rounded-full overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-1000"
            :class="barColorClass"
            :style="{ width: `${percentage}%` }"
          />
        </div>
        <div class="flex justify-between text-[10px] text-slate-500">
          <span>{{ vehicle.year }} • {{ vehicle.color || 'N/A' }}</span>
          <span v-if="vehicle.expected_amount > 0">
            Meta: R$ {{ formatCurrency(vehicle.expected_amount) }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="px-6 py-4 bg-slate-800/20 border-t border-slate-800/60 flex justify-between items-center"
    >
      <span
        class="text-[9px] text-slate-500 font-bold uppercase tracking-widest"
      >
        Detalhes do Veículo
      </span>
      <button
        class="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-emerald-400 hover:scale-110 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
        @click="emit('open-modal', vehicle)"
      >
        <Info class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
