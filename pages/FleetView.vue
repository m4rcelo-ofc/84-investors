<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from 'lucide-vue-next'
import type { Vehicle } from '~/types'
import AppHeader from '~/components/AppHeader.vue'
import FleetCard from '~/components/FleetCard.vue'
import VehicleModal from '~/components/VehicleModal.vue'
import { useAuth } from '~/composables/useAuth'
import { useFleet } from '~/composables/useFleet'
import { useModal } from '~/composables/useModal'
import { useMotoData } from '~/composables/useMotoData'
import { useMonthFilter } from '~/composables/useMonthFilter'

const { user: authUser } = useAuth()
const { user } = useMotoData()
const { fleetData, fetchFleet, isLoading, error } = useFleet()
const { isOpen, isAnimating, selectedVehicle, openModal, closeModal } = useModal()
const { selectedMonth, availableMonths, setMonth } = useMonthFilter()

const searchQuery = ref('')
const statusFilter = ref<string | null>(null)

const statusOptions = [
  { value: 'rented', label: 'Alugadas', color: 'cyan' },
  { value: 'maintenance', label: 'Manutenção', color: 'amber' },
  { value: 'available', label: 'Disponíveis', color: 'emerald' },
  { value: 'unavailable', label: 'Indisponíveis', color: 'red' },
]

const onMonthChange = async (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  setMonth(value)
  await fetchFleet()
}

onMounted(async () => {
  await fetchFleet()
})

const userInitials = computed(() => {
  if (authUser.value) {
    const names = authUser.value.name.split(' ')
    if (names.length >= 2) return names[0][0] + names[names.length - 1][0]
    return names[0].substring(0, 2).toUpperCase()
  }
  return user.value.initials
})

const filteredVehicles = computed(() => {
  let vehicles = fleetData.value

  if (statusFilter.value) {
    vehicles = vehicles.filter((v) => v.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    vehicles = vehicles.filter(
      (v) =>
        v.license_plate.toLowerCase().includes(query) ||
        v.model.toLowerCase().includes(query) ||
        v.brand.toLowerCase().includes(query),
    )
  }

  return vehicles
})

const handleOpenModal = (vehicle: Vehicle) => openModal(vehicle)

const toggleStatusFilter = (status: string) => {
  statusFilter.value = statusFilter.value === status ? null : status
}
</script>

<template>
  <div class="animate-fade-in pb-10">
    <AppHeader
      title="Minha Frota"
      subtitle="Status em tempo real"
      :user-name="authUser?.name || user.name"
      :user-initials="userInitials"
      :user-role="user.role"
    />

    <div class="flex items-center gap-3 mb-6">
      <select
        :value="selectedMonth"
        class="bg-slate-900/50 border border-slate-800 rounded-2xl py-3 px-4 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer"
        @change="onMonthChange"
      >
        <option
          v-for="month in availableMonths"
          :key="month.value"
          :value="month.value"
        >
          {{ month.label }}
        </option>
      </select>
    </div>

    <div class="space-y-4 mb-8">
      <div class="relative flex-1 max-w-md">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar por placa, modelo ou marca..."
          class="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-blue-500/40 text-slate-200"
        />
      </div>

      <div class="flex flex-wrap gap-2">
        <button
          v-for="option in statusOptions"
          :key="option.value"
          class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all"
          :class="[
            statusFilter === option.value
              ? option.color === 'cyan'
                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
                : option.color === 'amber'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : option.color === 'emerald'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-red-500/20 text-red-400 border-red-500/40'
              : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800',
          ]"
          @click="toggleStatusFilter(option.value)"
        >
          {{ option.label }}
        </button>
        <button
          v-if="statusFilter"
          class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border bg-slate-900/50 text-slate-400 border-slate-800 hover:bg-slate-800 transition-all"
          @click="statusFilter = null"
        >
          Limpar filtro
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-16">
      <p class="text-slate-500 text-sm">Carregando frota...</p>
    </div>

    <div v-else-if="error" class="text-center py-16">
      <p class="text-red-400 text-sm">{{ error }}</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <FleetCard
          v-for="vehicle in filteredVehicles"
          :key="vehicle.vehicle_id"
          :vehicle="vehicle"
          @open-modal="handleOpenModal"
        />
      </div>

      <div v-if="filteredVehicles.length === 0" class="text-center py-16">
        <p class="text-slate-500 text-sm">Nenhum veículo encontrado.</p>
      </div>
    </template>

    <VehicleModal
      :is-open="isOpen"
      :is-animating="isAnimating"
      :vehicle="selectedVehicle"
      @close="closeModal"
    />
  </div>
</template>
