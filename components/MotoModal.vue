<script setup lang="ts">
import { X, Camera } from "lucide-vue-next";
import type { Vehicle } from "~/types";

interface Props {
  isOpen: boolean;
  isAnimating: boolean;
  vehicle: Vehicle | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  close: [];
}>();

const { translateStatus } = useFleet();
const { formatCurrency } = useMotoData();

// Calcular porcentagem
const percentage = computed(() => {
  if (!props.vehicle) return 0;
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
  if (props.vehicle?.image) {
    return `http://localhost:8000/storage/${props.vehicle.image}`;
  }
  return null;
});

// Status traduzido
const displayStatus = computed(() => {
  if (!props.vehicle) return "";
  return translateStatus(props.vehicle.status);
});

// Classes do status
const statusClasses = computed(() => {
  if (!props.vehicle) return "";
  switch (props.vehicle.status) {
    case "rented":
      return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
    case "maintenance":
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    case "unavailable":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "available":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    default:
      return "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }
});

const handleBackdropClick = (e: MouseEvent) => {
  if (e.target === e.currentTarget) {
    emit("close");
  }
};
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
            <div
              v-if="imageUrl"
              class="w-16 h-16 rounded-2xl overflow-hidden"
            >
              <img
                :src="imageUrl"
                :alt="vehicle.model"
                class="w-full h-full object-cover"
              />
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
              <p
                class="text-blue-500 text-xs font-mono font-bold tracking-widest mt-1"
              >
                {{ vehicle.license_plate }}
              </p>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="mb-4">
            <span
              class="px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider border"
              :class="statusClasses"
            >
              {{ displayStatus }}
            </span>
          </div>

          <div class="space-y-4">
            <!-- Informações básicas -->
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

            <!-- Documentação -->
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

            <!-- Financeiro -->
            <div
              class="p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-bold text-slate-400">Meta do Ciclo</span>
                <span class="text-white font-bold">
                  R$ {{ formatCurrency(vehicle.expected_amount) }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-slate-400">Realizado</span>
                <span class="text-blue-400 font-bold">
                  R$ {{ formatCurrency(vehicle.paid_amount) }}
                </span>
              </div>
              <div
                class="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden"
              >
                <div
                  class="h-full bg-blue-500 transition-all duration-500"
                  :style="{ width: `${percentage}%` }"
                />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </Teleport>
</template>
