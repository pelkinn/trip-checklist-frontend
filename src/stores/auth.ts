import { defineStore } from 'pinia'
import type { UserProfile } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<UserProfile | null>(null)
  const token = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userEmail = computed(() => user.value?.email || '')
  const userRole = computed(() => user.value?.role || '')
  const isEmailVerified = computed(() => user.value?.emailVerified || false)

  // Actions
  // Установка токена
  const setToken = (newToken: string) => {
    token.value = newToken
    // Сохраняем в localStorage
    if (process.client) {
      localStorage.setItem('auth_token', newToken)
    }
  }

  // Установка пользователя
  const setUser = (newUser: UserProfile) => {
    user.value = newUser
  }

  // Установка состояния загрузки
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // Установка ошибки
  const setError = (errorMessage: string | null) => {
    error.value = errorMessage
  }

  // Вход в систему
  const login = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const authApi = useAuthApi()
      const response = await authApi.login({ email, password })
      
      setToken(response.access_token)
      setUser({
        id: response.id,
        email: response.email,
        role: 'USER', // По умолчанию, потом обновим через /auth/me
        emailVerified: false
      })
      
      // Загружаем полный профиль
      await fetchUserProfile()
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Ошибка входа в систему'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Регистрация
  const register = async (email: string, password: string) => {
    setLoading(true)
    setError(null)

    try {
      const authApi = useAuthApi()
      await authApi.register({ email, password })
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Ошибка регистрации'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Восстановление пароля
  const forgotPassword = async (email: string) => {
    setLoading(true)
    setError(null)

    try {
      const authApi = useAuthApi()
      await authApi.forgotPassword({ email })
    } catch (err: any) {
      const errorMessage = err.data?.message || 'Ошибка отправки письма'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Выход из системы
  const logout = () => {
    user.value = null
    token.value = null
    error.value = null
    
    if (process.client) {
      localStorage.removeItem('auth_token')
    }
  }

  // Получение профиля пользователя
  const fetchUserProfile = async () => {
    if (!token.value) return false
    
    try {
      const authApi = useAuthApi()
      const response = await authApi.fetchUserProfile(token.value)
      setUser(response)
      return true
    } catch (err: any) {
      // Если токен недействителен, очищаем авторизацию
      if (err.status === 401) {
        logout()
      }
      return false
    }
  }

  // Проверка токена при загрузке
  const checkAuth = async () => {
    if (process.client) {
      const savedToken = localStorage.getItem('auth_token')
      if (savedToken) {
        setToken(savedToken)
        await fetchUserProfile()
      }
    }
  }

  // Очистка ошибки
  const clearError = () => {
    setError(null)
  }

  return {
    // State
    user,
    token,
    isLoading,
    error,
    
    // Computed
    isAuthenticated,
    userEmail,
    userRole,
    isEmailVerified,
    
    // Functions
    setToken,
    setUser,
    setLoading,
    setError,
    login,
    register,
    forgotPassword,
    logout,
    fetchUserProfile,
    checkAuth,
    clearError
  }
})
