<script setup lang="ts">
import { Search } from "lucide-vue-next";
import type { Vehicle } from "~/types";

// Composables
const { isAuthenticated, login, logout, user: authUser, checkAuth } = useAuth();
const { user } = useMotoData();
const {
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
} = useDashboard();
const {
  fleetData,
  fetchFleet,
  clearFleet,
} = useFleet();
const { isOpen, selectedVehicle, isAnimating, openModal, closeModal } = useModal();

// Referência para o componente de login
const loginScreenRef = ref<{
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
} | null>(null);

// Current view state
const currentView = ref<"dashboard" | "frota">("dashboard");
const searchQuery = ref("");
const statusFilter = ref<string | null>(null);

// Status filter options
const statusOptions = [
  { value: "rented", label: "Alugadas", color: "emerald" },
  { value: "maintenance", label: "Manutenção", color: "amber" },
  { value: "available", label: "Disponíveis", color: "indigo" },
  { value: "unavailable", label: "Indisponíveis", color: "red" },
];

// Verificar autenticação e carregar dados ao carregar
onMounted(async () => {
  checkAuth();
  if (isAuthenticated.value) {
    await Promise.all([fetchDashboard(), fetchFleet()]);
  }
});

// Carregar dados quando autenticado
watch(isAuthenticated, async (newValue) => {
  if (newValue) {
    await Promise.all([fetchDashboard(), fetchFleet()]);
  }
});

// Carregar frota quando mudar para a view de frota
watch(currentView, async (newView) => {
  if (newView === "frota" && fleetData.value.length === 0) {
    await fetchFleet();
  }
});

// Nome do usuário logado
const userName = computed(() => {
  if (authUser.value) {
    const firstName = authUser.value.name.split(" ")[0];
    return firstName;
  }
  return user.value.name;
});

// Iniciais do usuário
const userInitials = computed(() => {
  if (authUser.value) {
    const names = authUser.value.name.split(" ");
    if (names.length >= 2) {
      return names[0][0] + names[names.length - 1][0];
    }
    return names[0].substring(0, 2).toUpperCase();
  }
  return user.value.initials;
});

// Page title and subtitle based on current view
const pageInfo = computed(() => {
  if (currentView.value === "dashboard") {
    return {
      title: `Olá, ${userName.value}`,
      subtitle: "Dashboard",
    };
  }
  return {
    title: "Minha Frota",
    subtitle: "Status em tempo real",
  };
});

// Handle login
const handleLogin = async (email: string, password: string) => {
  const result = await login(email, password);
  if (!result.success && loginScreenRef.value) {
    loginScreenRef.value.setError(result.error || "Erro ao fazer login");
  }
};

// Handle logout
const handleLogout = async () => {
  await logout();
  clearDashboard();
  clearFleet();
  currentView.value = "dashboard";
};

// Switch view
const switchView = (view: "dashboard" | "frota") => {
  currentView.value = view;
};

// Open modal with vehicle
const handleOpenModal = (vehicle: Vehicle) => {
  openModal(vehicle);
};

// Toggle status filter
const toggleStatusFilter = (status: string) => {
  if (statusFilter.value === status) {
    statusFilter.value = null;
  } else {
    statusFilter.value = status;
  }
};

// Filtered vehicles for search and status
const filteredVehicles = computed(() => {
  let vehicles = fleetData.value;

  // Filtrar por status
  if (statusFilter.value) {
    vehicles = vehicles.filter((vehicle) => vehicle.status === statusFilter.value);
  }

  // Filtrar por busca
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    vehicles = vehicles.filter(
      (vehicle) =>
        vehicle.license_plate.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.brand.toLowerCase().includes(query),
    );
  }

  return vehicles;
});

// Top motos por receita (baseado nos dados da API)
const topMotos = computed(() => {
  return revenueByPlate.value.slice(0, 4).map((item, index) => ({
    id: index + 1,
    plate: item.plate,
    received: item.received,
    target: 1500,
    status: "Alugada" as const,
    model: "Moto",
    year: 2024,
    color: "Preta",
  }));
});
</script>

<template>
  <div class="selection:bg-emerald-500/30 overflow-x-hidden">
    <!-- Login Screen -->
    <Transition
      enter-active-class="transition-opacity duration-500"
      leave-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <LoginScreen
        v-if="!isAuthenticated"
        ref="loginScreenRef"
        @login="handleLogin"
      />
    </Transition>

    <!-- Main App Layout -->
    <Transition
      enter-active-class="transition-opacity duration-700"
      leave-active-class="transition-opacity duration-700"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div v-if="isAuthenticated" class="min-h-screen">
        <!-- Sidebar Navigation -->
        <AppSidebar
          :current-view="currentView"
          @switch-view="switchView"
          @logout="handleLogout"
        />

        <!-- Main Content Area -->
        <main class="lg:pl-24 relative z-10">
          <div class="p-6 md:p-10 max-w-[1500px] mx-auto min-h-screen">
            <!-- Header -->
            <AppHeader
              :title="pageInfo.title"
              :subtitle="pageInfo.subtitle"
              :user-name="authUser?.name || user.name"
              :user-initials="userInitials"
              :user-role="user.role"
            />

            <!-- DASHBOARD VIEW -->
            <div
              v-show="currentView === 'dashboard'"
              class="space-y-8 animate-fade-in"
            >
              <!-- Top Stats - Apenas 2 cards agora -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <StatsCard
                  type="contract"
                  label="Início do Contrato"
                  :value="contractInfo.startDate"
                  :subtext="`Contrato: ${contractInfo.months} meses`"
                />
                <StatsCard
                  type="payment"
                  label="Ciclo Atual"
                  :value="`Ciclo ${cycleInfo.number}`"
                  :subtext="`${formatCycleDate(cycleInfo.start)} - ${formatCycleDate(cycleInfo.end)}`"
                />
              </div>

              <!-- Charts Section -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div class="lg:col-span-8">
                  <DailyChart
                    :data="dailyData"
                    :total-revenue="totalRevenue"
                    :comparative-revenue="comparativeRevenue"
                  />
                </div>
                <div class="lg:col-span-4">
                  <FleetStatusChart
                    :alugadas="vehicleStats.rented"
                    :manutencao="vehicleStats.maintenance"
                    :disponiveis="vehicleStats.available"
                    :indisponiveis="vehicleStats.unavailable"
                  />
                </div>
              </div>

              <!-- Bottom Grid - Apenas 2 colunas agora -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
                <MotoList :motos="topMotos" />
                <WeeklyChart
                  :data="weeklyData"
                  :total-revenue="totalRevenue"
                  :comparative-revenue="comparativeRevenue"
                />
              </div>
            </div>

            <!-- FLEET VIEW -->
            <div v-show="currentView === 'frota'" class="animate-fade-in pb-10">
              <!-- Search and Filters -->
              <div class="space-y-4 mb-8">
                <div class="relative flex-1 max-w-md">
                  <Search
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5"
                  />
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Buscar por placa, modelo ou marca..."
                    class="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/40 text-slate-200"
                  />
                </div>

                <!-- Status Filter Buttons -->
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="option in statusOptions"
                    :key="option.value"
                    class="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border transition-all"
                    :class="[
                      statusFilter === option.value
                        ? option.color === 'emerald'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                          : option.color === 'amber'
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                            : option.color === 'indigo'
                              ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40'
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

              <!-- Fleet Grid Container -->
              <div
                class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                <FleetCard
                  v-for="vehicle in filteredVehicles"
                  :key="vehicle.vehicle_id"
                  :vehicle="vehicle"
                  @open-modal="handleOpenModal"
                />
              </div>

              <!-- Empty State -->
              <div
                v-if="filteredVehicles.length === 0"
                class="text-center py-16"
              >
                <p class="text-slate-500 text-sm">
                  Nenhum veículo encontrado.
                </p>
              </div>
            </div>
          </div>
        </main>

        <!-- Background Decor -->
        <BackgroundDecor />
      </div>
    </Transition>

    <!-- Modal -->
    <MotoModal
      :is-open="isOpen"
      :is-animating="isAnimating"
      :vehicle="selectedVehicle"
      @close="closeModal"
    />
  </div>
</template>
