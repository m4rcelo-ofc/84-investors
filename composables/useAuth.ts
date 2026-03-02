import { ref } from 'vue'
import { useApi } from './useApi'

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

const isAuthenticated = ref(false)
const user = ref<User | null>(null)

export const useAuth = () => {
  const api = useApi()
  const isLoggingIn = ref(false)
  const isLoggingOut = ref(false)
  const loginError = ref<string | null>(null)

  const checkAuth = () => {
    const token = localStorage.getItem('access_token')
    const storedUser = localStorage.getItem('user')
    if (token && storedUser) {
      isAuthenticated.value = true
      user.value = JSON.parse(storedUser)
    }
  }

  const login = async (email: string, password: string) => {
    isLoggingIn.value = true
    loginError.value = null

    try {
      const response = await api.post<LoginResponse>('/investors/login', { email, password })
      const { access_token, user: userData } = response.data.data

      localStorage.setItem('access_token', access_token)
      localStorage.setItem('user', JSON.stringify(userData))

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
    await new Promise((resolve) => setTimeout(resolve, 500))

    localStorage.removeItem('access_token')
    localStorage.removeItem('user')

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