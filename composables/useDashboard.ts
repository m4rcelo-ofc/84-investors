import { ref, computed } from 'vue'
import { useApi } from './useApi'
import { useMonthFilter } from './useMonthFilter'

interface VehicleStats {
  rented: number
  available: number
  unavailable: number
  maintenance: number
}

interface MonthInfo {
  year_month: string
  start: string
  end: string
}

interface Financials {
  total_revenue: number
  total_insurance: number
  by_plate: Record<string, number>
  insurance_by_plate: Record<string, number>
}

interface DashboardData {
  vehicle_stats: VehicleStats
  contract_start_date: string
  contract_end_date: string
  month_info: MonthInfo
  financials: Financials
}

interface DashboardResponse {
  status: string
  message: string
  data: DashboardData
}

// Module-level singleton state
const dashboardData = ref<DashboardData | null>(null)

export const useDashboard = () => {
  const api = useApi()
  const { selectedMonth, setContractStartDate } = useMonthFilter()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchDashboard = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<DashboardResponse>('/investors/dashboard', {
        params: { month: selectedMonth.value },
      })
      dashboardData.value = response.data.data
      setContractStartDate(response.data.data.contract_start_date ?? null)
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar dashboard'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const vehicleStats = computed(() => {
    if (!dashboardData.value) {
      return { rented: 0, available: 0, unavailable: 0, maintenance: 0 }
    }
    const stats = dashboardData.value.vehicle_stats
    return {
      rented: stats.rented ?? 0,
      available: stats.available ?? 0,
      unavailable: stats.unavailable ?? 0,
      maintenance: stats.maintenance ?? 0,
    }
  })

  const monthInfo = computed(() => {
    if (!dashboardData.value) return { year_month: '', start: '', end: '' }
    return dashboardData.value.month_info
  })

  const contractInfo = computed(() => {
    if (!dashboardData.value) {
      return { startDate: '', endDate: '', months: null as number | null }
    }

    const rawStart = dashboardData.value.contract_start_date
    const rawEnd = dashboardData.value.contract_end_date
    const start = rawStart ? new Date(rawStart) : null
    const end = rawEnd ? new Date(rawEnd) : null
    const months =
      start && end
        ? Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))
        : null

    return {
      startDate: start ? start.toLocaleDateString('pt-BR') : '',
      endDate: end ? end.toLocaleDateString('pt-BR') : '',
      months,
    }
  })

  const totalRevenue = computed(() => dashboardData.value?.financials.total_revenue ?? 0)
  const totalInsurance = computed(() => dashboardData.value?.financials.total_insurance ?? 0)

  const revenueByPlate = computed(() => {
    if (!dashboardData.value) return []
    const insuranceByPlate = dashboardData.value.financials.insurance_by_plate ?? {}
    return Object.entries(dashboardData.value.financials.by_plate).map(([plate, received]) => ({
      plate,
      received,
      insurance: insuranceByPlate[plate] ?? 0,
    }))
  })

  const formatMonthDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('pt-BR')
  }

  const clearDashboard = () => {
    dashboardData.value = null
  }

  return {
    dashboardData,
    isLoading,
    error,
    fetchDashboard,
    vehicleStats,
    monthInfo,
    contractInfo,
    totalRevenue,
    totalInsurance,
    revenueByPlate,
    formatMonthDate,
    clearDashboard,
  }
}
