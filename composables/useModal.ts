import { ref } from 'vue'
import type { Vehicle } from '~/types'

// Module-level singleton state
const isOpen = ref(false)
const selectedVehicle = ref<Vehicle | null>(null)
const isAnimating = ref(false)

export const useModal = () => {
  const openModal = (vehicle: Vehicle) => {
    selectedVehicle.value = vehicle
    isOpen.value = true
    setTimeout(() => {
      isAnimating.value = true
    }, 10)
  }

  const closeModal = () => {
    isAnimating.value = false
    setTimeout(() => {
      isOpen.value = false
      selectedVehicle.value = null
    }, 300)
  }

  return {
    isOpen,
    selectedVehicle,
    isAnimating,
    openModal,
    closeModal,
  }
}
