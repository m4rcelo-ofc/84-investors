import { ref } from 'vue'
import { useApi } from './useApi'

export interface Vehicle {
  vehicle_id: number
  license_plate: string
  model: string
  brand: string
  year: number
  status: 'rented' | 'available' | 'unavailable' | 'maintenance'
  color: string | null
  renavam: string
  chassi: string
  image: string | null
  expected_amount: number
  paid_amount: number
}

// Module-level singleton state
const fleetData = ref<Vehicle[]>([])

export const useFleet = () => {
  const api = useApi()
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchFleet = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await api.get<Vehicle[]>('/investors/fleet')
      fleetData.value = Array.isArray(response.data) ? response.data : []
      return { success: true }
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Erro ao carregar frota'
      return { success: false, error: error.value }
    } finally {
      isLoading.value = false
    }
  }

  const translateStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      rented: 'Alugada',
      available: 'Disponível',
      unavailable: 'Indisponível',
      maintenance: 'Manutenção',
    }
    return statusMap[status] || status
  }

  const getVehicleById = (id: number) => fleetData.value.find((v) => v.vehicle_id === id)

  const clearFleet = () => {
    fleetData.value = []
  }

  return {
    fleetData,
    isLoading,
    error,
    fetchFleet,
    translateStatus,
    getVehicleById,
    clearFleet,
  }
}
