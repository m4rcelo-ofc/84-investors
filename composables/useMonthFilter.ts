import { ref, computed } from 'vue'

const STORAGE_KEY = 'selected_month'
const DEFAULT_START = '2025-12'

function currentYearMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

function initMonth(): string {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) return stored
  return currentYearMonth()
}

// Module-level singleton state
const selectedMonth = ref<string>(initMonth())
const contractStartDate = ref<string | null>(null)

export const useMonthFilter = () => {
  const setMonth = (month: string) => {
    selectedMonth.value = month
    localStorage.setItem(STORAGE_KEY, month)
  }

  const setContractStartDate = (date: string | null) => {
    contractStartDate.value = date
  }

  const availableMonths = computed(() => {
    const rawStart = contractStartDate.value
    const start = rawStart ? rawStart.substring(0, 7) : DEFAULT_START
    const current = currentYearMonth()

    const months: { value: string; label: string }[] = []
    let cursor = start

    while (cursor <= current) {
      const [year, month] = cursor.split('-').map(Number)
      const date = new Date(year, month - 1, 1)
      months.push({
        value: cursor,
        label: date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
      })
      const next = new Date(year, month, 1)
      cursor = `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`
    }

    return months.reverse()
  })

  return {
    selectedMonth,
    contractStartDate,
    setMonth,
    setContractStartDate,
    availableMonths,
  }
}
