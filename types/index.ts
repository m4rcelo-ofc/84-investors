export interface Moto {
  id: number
  plate: string
  received: number
  target: number
  status: 'Alugada' | 'Manutenção' | 'Disponível' | 'Indisponível'
  model: string
  year: number
  color: string
}

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

export interface DailyData {
  day: number
  valor: number
}

export interface WeeklyData {
  x: string
  y: number
}

export interface Expense {
  id: number
  title: string
  date: string
  amount: number
}

export interface User {
  name: string
  initials: string
  role: string
}
