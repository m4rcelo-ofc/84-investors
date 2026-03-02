<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import LoginScreen from '~/components/LoginScreen.vue'
import { useAuth } from '~/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const loginScreenRef = ref<{
  setError: (error: string) => void
  setLoading: (loading: boolean) => void
} | null>(null)

const handleLogin = async (email: string, password: string) => {
  const result = await login(email, password)
  if (result.success) {
    router.push('/')
  } else if (loginScreenRef.value) {
    loginScreenRef.value.setError(result.error || 'Erro ao fazer login')
  }
}
</script>

<template>
  <LoginScreen ref="loginScreenRef" @login="handleLogin" />
</template>
