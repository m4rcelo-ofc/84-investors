import type { Vehicle } from "~/types";

export const useModal = () => {
  const isOpen = useState<boolean>("modalOpen", () => false);
  const selectedVehicle = useState<Vehicle | null>("selectedVehicle", () => null);
  const isAnimating = ref(false);

  const openModal = (vehicle: Vehicle) => {
    selectedVehicle.value = vehicle;
    isOpen.value = true;
    // Small delay for animation
    setTimeout(() => {
      isAnimating.value = true;
    }, 10);
  };

  const closeModal = () => {
    isAnimating.value = false;
    setTimeout(() => {
      isOpen.value = false;
      selectedVehicle.value = null;
    }, 300);
  };

  return {
    isOpen,
    selectedVehicle,
    isAnimating,
    openModal,
    closeModal,
  };
};
