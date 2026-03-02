import { ref } from 'vue'
import type { User } from '~/types'

export const useMotoData = () => {
  const user = ref<User>({
    name: 'Investidor',
    initials: 'IV',
    role: 'Investidor Ativo',
  })

  const formatCurrency = (value: number) =>
    value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return { user, formatCurrency }
}
