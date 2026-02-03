import api from '~/services/api'

interface User {
  id: number
  name: string
  email: string
}

interface LoginResponse {
  status: string
  message: string
  data: {
    access_token: string
    token_type: string
    user: User
  }
}

export const useAuth = () => {
  const isAuthenticated = useState<boolean>('isAuthenticated', () => false)
  const isLoggingIn = ref(false)
  const isLoggingOut = ref(false)
  const user = useState<User | null>('user', () => null)
  const loginError = ref<string | null>(null)

  // Verificar se já está autenticado ao carregar
  const checkAuth = () => {
    if (import.meta.client) {
      const token = localStorage.getItem('access_token')
      const storedUser = localStorage.getItem('user')
      if (token && storedUser) {
        isAuthenticated.value = true
        user.value = JSON.parse(storedUser)
      }
    }
  }

  const login = async (email: string, password: string) => {
    isLoggingIn.value = true
    loginError.value = null

    try {
      const response = await api.post<LoginResponse>('/investors/login', {
        email,
        password,
      })

      const { access_token, user: userData } = response.data.data

      // Salvar no localStorage
      if (import.meta.client) {
        localStorage.setItem('access_token', access_token)
        localStorage.setItem('user', JSON.stringify(userData))
      }

      user.value = userData
      isAuthenticated.value = true

      return { success: true }
    } catch (error: any) {
      loginError.value = error.response?.data?.message || 'Erro ao fazer login'
      return { success: false, error: loginError.value }
    } finally {
      isLoggingIn.value = false
    }
  }

  const logout = async () => {
    isLoggingOut.value = true

    // Pequeno delay para animação
    await new Promise(resolve => setTimeout(resolve, 500))

    // Limpar localStorage
    if (import.meta.client) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    }

    user.value = null
    isAuthenticated.value = false
    isLoggingOut.value = false
  }

  return {
    isAuthenticated,
    isLoggingIn,
    isLoggingOut,
    user,
    loginError,
    login,
    logout,
    checkAuth,
  }
}
