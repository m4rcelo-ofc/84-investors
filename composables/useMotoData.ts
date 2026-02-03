import type { Moto, DailyData, WeeklyData, Expense, User } from '~/types'

export const useMotoData = () => {
  const fullMotoList = ref<Moto[]>([
    { id: 1, plate: 'ABC-1234', received: 1250, target: 1500, status: 'Alugada', model: 'Honda CG 160 Start', year: 2023, color: 'Vermelha' },
    { id: 2, plate: 'XYZ-9876', received: 1400, target: 1500, status: 'Alugada', model: 'Yamaha Fazer 250', year: 2022, color: 'Azul' },
    { id: 3, plate: 'KLP-4455', received: 980, target: 1500, status: 'Manutenção', model: 'Honda Biz 125', year: 2024, color: 'Branca' },
    { id: 4, plate: 'MOT-0084', received: 1500, target: 1500, status: 'Alugada', model: 'Honda CG 160 Titan', year: 2023, color: 'Preta' },
    { id: 5, plate: 'QWE-1122', received: 0, target: 1500, status: 'Disponível', model: 'Yamaha Factor 150', year: 2022, color: 'Vermelha' },
    { id: 6, plate: 'RTY-3344', received: 1100, target: 1500, status: 'Alugada', model: 'Honda CG 160 Fan', year: 2023, color: 'Prata' },
  ])

  const dailyData = ref<DailyData[]>(
    Array.from({ length: 30 }, (_, i) => ({
      day: i + 1,
      valor: Math.floor(Math.random() * (800 - 300 + 1) + 300),
    }))
  )

  const weeklyData = ref<WeeklyData[]>([
    { x: 'Sem 1', y: 3850 },
    { x: 'Sem 2', y: 4200 },
    { x: 'Sem 3', y: 4900 },
    { x: 'Sem 4', y: 5500 },
  ])

  const expenses = ref<Expense[]>([
    { id: 1, title: 'Manutenção Preventiva', date: '20/05', amount: 1200 },
    { id: 2, title: 'Seguro Frota', date: '15/05', amount: 3400 },
    { id: 3, title: 'Taxas Administrativas', date: '10/05', amount: 450 },
  ])

  const user = ref<User>({
    name: 'Carlos Eduardo Silva',
    initials: 'CS',
    role: 'Investidor Ativo',
  })

  const fleetStatus = computed(() => ({
    alugadas: fullMotoList.value.filter(m => m.status === 'Alugada').length,
    manutencao: fullMotoList.value.filter(m => m.status === 'Manutenção').length,
    disponiveis: fullMotoList.value.filter(m => m.status === 'Disponível').length,
  }))

  const topMotos = computed(() => fullMotoList.value.slice(0, 4))

  const getMotoById = (id: number) => fullMotoList.value.find(m => m.id === id)

  const calculatePercentage = (received: number, target: number) => {
    return Math.round((received / target) * 100)
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR')
  }

  return {
    fullMotoList,
    dailyData,
    weeklyData,
    expenses,
    user,
    fleetStatus,
    topMotos,
    getMotoById,
    calculatePercentage,
    formatCurrency,
  }
}
