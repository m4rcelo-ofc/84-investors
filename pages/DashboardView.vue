<script setup lang="ts">
import { computed, onMounted } from 'vue'
import AppHeader from '~/components/AppHeader.vue'
import StatsCard from '~/components/StatsCard.vue'
import DailyChart from '~/components/DailyChart.vue'
import WeeklyChart from '~/components/WeeklyChart.vue'
import FleetStatusChart from '~/components/FleetStatusChart.vue'
import VehicleList from '~/components/VehicleList.vue'
import { useAuth } from '~/composables/useAuth'
import { useDashboard } from '~/composables/useDashboard'
import { useMotoData } from '~/composables/useMotoData'
import { useMonthFilter } from '~/composables/useMonthFilter'

const { user: authUser } = useAuth()
const { user } = useMotoData()
const {
  fetchDashboard,
  vehicleStats,
  monthInfo,
  contractInfo,
  dailyData,
  weeklyData,
  totalRevenue,
  comparativeRevenue,
  revenueByPlate,
  formatMonthDate,
} = useDashboard()
const { selectedMonth, availableMonths, setMonth } = useMonthFilter()

const onMonthChange = async (event: Event) => {
  const value = (event.target as HTMLSelectElement).value
  setMonth(value)
  await fetchDashboard()
}

onMounted(async () => {
  await fetchDashboard()
})

const userName = computed(() => {
  if (authUser.value) return authUser.value.name.split(' ')[0]
  return user.value.name
})

const userInitials = computed(() => {
  if (authUser.value) {
    const names = authUser.value.name.split(' ')
    if (names.length >= 2) return names[0][0] + names[names.length - 1][0]
    return names[0].substring(0, 2).toUpperCase()
  }
  return user.value.initials
})
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <AppHeader
      :title="`Olá, ${userName}`"
      subtitle="Dashboard"
      :user-name="authUser?.name || user.name"
      :user-initials="userInitials"
      :user-role="user.role"
    />

    <div class="flex items-center gap-3">
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

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <StatsCard
        type="contract"
        label="Início do Contrato"
        :value="contractInfo.startDate"
        :subtext="
          contractInfo.months != null ? `Contrato: ${contractInfo.months} meses` : undefined
        "
      />
      <StatsCard
        type="payment"
        label="Mês Atual"
        :value="
          monthInfo.year_month
            ? new Date(monthInfo.year_month + '-01T00:00:00').toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })
            : ''
        "
        :subtext="
          monthInfo.start
            ? `${formatMonthDate(monthInfo.start)} - ${formatMonthDate(monthInfo.end)}`
            : undefined
        "
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
      <div class="md:col-span-8">
        <DailyChart
          :data="dailyData"
          :total-revenue="totalRevenue"
          :comparative-revenue="comparativeRevenue"
        />
      </div>
      <div class="md:col-span-4">
        <FleetStatusChart
          :alugadas="vehicleStats.rented"
          :manutencao="vehicleStats.maintenance"
          :disponiveis="vehicleStats.available"
          :indisponiveis="vehicleStats.unavailable"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
      <VehicleList :vehicles="revenueByPlate" />
      <WeeklyChart
        :data="weeklyData"
        :total-revenue="totalRevenue"
        :comparative-revenue="comparativeRevenue"
      />
    </div>
  </div>
</template>
