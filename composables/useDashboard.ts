interface VehicleStats {
  rented: number;
  available: number;
  unavailable: number;
  maintenance: number;
}

interface CycleInfo {
  number: number;
  start: string;
  end: string;
}

interface DailyRevenue {
  day_number: number;
  date: string;
  value: number;
}

interface WeeklyRevenue {
  week_1: number;
  week_2: number;
  week_3: number;
  week_4: number;
}

interface Financials {
  total_revenue: number;
  by_plate: Record<string, number>;
  weekly_revenue: WeeklyRevenue;
  daily_revenue: DailyRevenue[];
}

interface Comparative {
  total_revenue: number;
}

interface DashboardData {
  vehicle_stats: VehicleStats;
  contract_start_date: string;
  contract_end_date: string;
  cycle_info: CycleInfo;
  financials: Financials;
  comparative: Comparative;
}

interface DashboardResponse {
  status: string;
  message: string;
  data: DashboardData;
}

export const useDashboard = () => {
  const api = useApi();

  // Estado reativo para os dados do dashboard (apenas sessão, não localStorage)
  const dashboardData = useState<DashboardData | null>(
    "dashboardData",
    () => null,
  );
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  // Buscar dados do dashboard
  const fetchDashboard = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await api.get<DashboardResponse>("/investors/dashboard");
      dashboardData.value = response.data.data;
      return { success: true };
    } catch (err: any) {
      error.value = err.response?.data?.message || "Erro ao carregar dashboard";
      return { success: false, error: error.value };
    } finally {
      isLoading.value = false;
    }
  };

  // Dados formatados para os componentes
  const vehicleStats = computed(() => {
    if (!dashboardData.value) {
      return { rented: 0, available: 0, unavailable: 0, maintenance: 0 };
    }
    const stats = dashboardData.value.vehicle_stats;
    return {
      rented: stats.rented ?? 0,
      available: stats.available ?? 0,
      unavailable: stats.unavailable ?? 0,
      maintenance: stats.maintenance ?? 0,
    };
  });

  const cycleInfo = computed(() => {
    if (!dashboardData.value) {
      return { number: 0, start: "", end: "" };
    }
    return dashboardData.value.cycle_info;
  });

  const contractInfo = computed(() => {
    if (!dashboardData.value) {
      return { startDate: "", endDate: "", months: 0 };
    }
    const start = new Date(dashboardData.value.contract_start_date);
    const end = new Date(dashboardData.value.contract_end_date);
    const months = Math.round(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30),
    );

    return {
      startDate: start.toLocaleDateString("pt-BR"),
      endDate: end.toLocaleDateString("pt-BR"),
      months,
    };
  });

  const dailyData = computed(() => {
    if (!dashboardData.value) return [];
    return dashboardData.value.financials.daily_revenue.map((d) => ({
      day: d.day_number,
      valor: d.value,
    }));
  });

  const weeklyData = computed(() => {
    if (!dashboardData.value) return [];
    const weekly = dashboardData.value.financials.weekly_revenue;
    return [
      { x: "Sem 1", y: weekly.week_1 },
      { x: "Sem 2", y: weekly.week_2 },
      { x: "Sem 3", y: weekly.week_3 },
      { x: "Sem 4", y: weekly.week_4 },
    ];
  });

  const totalRevenue = computed(() => {
    if (!dashboardData.value) return 0;
    return dashboardData.value.financials.total_revenue;
  });

  const comparativeRevenue = computed(() => {
    if (!dashboardData.value) return 0;
    return dashboardData.value.comparative.total_revenue;
  });

  const revenueByPlate = computed(() => {
    if (!dashboardData.value) return [];
    const byPlate = dashboardData.value.financials.by_plate;
    return Object.entries(byPlate).map(([plate, received]) => ({
      plate,
      received,
    }));
  });

  // Formatar data do ciclo
  const formatCycleDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("pt-BR");
  };

  // Limpar dados ao fazer logout
  const clearDashboard = () => {
    dashboardData.value = null;
  };

  return {
    dashboardData,
    isLoading,
    error,
    fetchDashboard,
    vehicleStats,
    cycleInfo,
    contractInfo,
    dailyData,
    weeklyData,
    totalRevenue,
    comparativeRevenue,
    revenueByPlate,
    formatCycleDate,
    clearDashboard,
  };
};
