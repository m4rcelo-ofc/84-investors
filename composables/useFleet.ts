export interface Vehicle {
  vehicle_id: number;
  license_plate: string;
  model: string;
  brand: string;
  year: number;
  status: "rented" | "available" | "unavailable" | "maintenance";
  color: string | null;
  renavam: string;
  chassi: string;
  image: string | null;
  expected_amount: number;
  paid_amount: number;
}

interface FleetResponse {
  status?: string;
  message?: string;
  data?: Vehicle[];
}

export const useFleet = () => {
  const api = useApi();

  // Estado reativo para os dados da frota (apenas sessão)
  const fleetData = useState<Vehicle[]>("fleetData", () => []);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Buscar dados da frota
  const fetchFleet = async () => {
    // Verificar se já tem dados no sessionStorage
    if (import.meta.client) {
      const cached = sessionStorage.getItem("fleetData");
      if (cached) {
        fleetData.value = JSON.parse(cached);
        return { success: true };
      }
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get<Vehicle[] | FleetResponse>("/investors/fleet");

      // A API pode retornar diretamente um array ou um objeto com data
      const vehicles = Array.isArray(response.data)
        ? response.data
        : response.data.data || [];

      fleetData.value = vehicles;

      // Salvar no sessionStorage
      if (import.meta.client) {
        sessionStorage.setItem("fleetData", JSON.stringify(vehicles));
      }

      return { success: true };
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao carregar frota";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Traduzir status para português
  const translateStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      rented: "Alugada",
      available: "Disponível",
      unavailable: "Indisponível",
      maintenance: "Manutenção",
    };
    return statusMap[status] || status;
  };

  // Obter veículo por ID
  const getVehicleById = (id: number) => {
    return fleetData.value.find((v) => v.vehicle_id === id);
  };

  // Filtrar veículos por status
  const getVehiclesByStatus = (status: string) => {
    return fleetData.value.filter((v) => v.status === status);
  };

  // Limpar dados ao fazer logout
  const clearFleet = () => {
    fleetData.value = [];
    if (import.meta.client) {
      sessionStorage.removeItem("fleetData");
    }
  };

  // Forçar recarregar (ignorar cache)
  const refreshFleet = async () => {
    if (import.meta.client) {
      sessionStorage.removeItem("fleetData");
    }
    return fetchFleet();
  };

  return {
    fleetData,
    isLoading,
    error,
    fetchFleet,
    translateStatus,
    getVehicleById,
    getVehiclesByStatus,
    clearFleet,
    refreshFleet,
  };
};
