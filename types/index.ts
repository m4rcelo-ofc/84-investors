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
  a_receber: number
  insurance: number
  bar_pct: number
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
