import { ref, computed } from 'vue'
import type { 
  LoginDto, 
  RegisterDto, 
  ForgotPasswordDto, 
  ResetPasswordDto, 
  VerifyEmailDto, 
  ResendVerificationDto,
  AuthResponse,
  UserProfile,
  RegisterResponse 
} from '~/types/auth'



// Состояние авторизации
const user = ref<UserProfile | null>(null)
const token = ref<string | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

// Проверяем, авторизован ли пользователь
const isAuthenticated = computed(() => !!token.value && !!user.value)

// Проверяем роль пользователя
const isAdmin = computed(() => user.value?.role === 'ADMIN')
const isModerator = computed(() => user.value?.role === 'MODERATOR' || user.value?.role === 'ADMIN')

// Инициализация токена из localStorage
const initializeAuth = () => {
  if (process.client) {
    const savedToken = localStorage.getItem('auth_token')
    if (savedToken) {
      token.value = savedToken
      // Загружаем профиль пользователя
      fetchUserProfile()
    }
  }
}

// Сохранение токена в localStorage
const saveToken = (newToken: string) => {
  token.value = newToken
  if (process.client) {
    localStorage.setItem('auth_token', newToken)
  }
}

// Удаление токена из localStorage
const clearToken = () => {
  token.value = null
  if (process.client) {
    localStorage.removeItem('auth_token')
  }
}

// Вход в систему
const login = async (credentials: LoginDto): Promise<boolean> => {
  isLoading.value = true
  error.value = null
  
  const apiConfig = useApiConfig()
  
  try {
    const response = await $fetch<AuthResponse>(`${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.LOGIN}`, {
      method: 'POST',
      body: credentials
    })
    
    saveToken(response.access_token)
    user.value = {
      id: response.id,
      email: response.email,
      role: 'USER', // По умолчанию, потом обновим через /auth/me
      emailVerified: false
    }
    
    // Загружаем полный профиль
    await fetchUserProfile()
    
    return true
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка входа в систему'
    return false
  } finally {
    isLoading.value = false
  }
}

// Регистрация
const register = async (userData: RegisterDto): Promise<boolean> => {
  isLoading.value = true
  error.value = null
  
  const apiConfig = useApiConfig()
  
  try {
    const response = await $fetch<RegisterResponse>(`${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.REGISTER}`, {
      method: 'POST',
      body: userData
    })
    
    return true
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка регистрации'
    return false
  } finally {
    isLoading.value = false
  }
}

// Выход из системы
const logout = () => {
  user.value = null
  clearToken()
  error.value = null
}

// Получение профиля пользователя
const fetchUserProfile = async (): Promise<boolean> => {
  if (!token.value) return false
  
  const apiConfig = useApiConfig()
  
  try {
    const response = await $fetch<UserProfile>(`${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.ME}`, {
      headers: {
        'Authorization': `Bearer ${token.value}`
      }
    })
    
    user.value = response
    return true
  } catch (err: any) {
    // Если токен недействителен, очищаем авторизацию
    if (err.status === 401) {
      logout()
    }
    return false
  }
}

// Запрос сброса пароля
const forgotPassword = async (emailData: ForgotPasswordDto): Promise<boolean> => {
  isLoading.value = true
  error.value = null
  
  const apiConfig = useApiConfig()
  
  try {
    await $fetch(`${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
      method: 'POST',
      body: emailData
    })
    
    return true
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка запроса сброса пароля'
    return false
  } finally {
    isLoading.value = false
  }
}

// Сброс пароля
const resetPassword = async (resetData: ResetPasswordDto): Promise<boolean> => {
  isLoading.value = true
  error.value = null
  
  const apiConfig = useApiConfig()
  
  try {
    await $fetch(`${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.RESET_PASSWORD}`, {
      method: 'POST',
      body: resetData
    })
    
    return true
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка сброса пароля'
    return false
  } finally {
    isLoading.value = false
  }
}

// Подтверждение email
const verifyEmail = async (verifyData: VerifyEmailDto): Promise<boolean> => {
  isLoading.value = true
  error.value = null
  
  const apiConfig = useApiConfig()
  
  try {
    await $fetch(`${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.VERIFY_EMAIL}`, {
      method: 'POST',
      body: verifyData
    })
    
    // Обновляем профиль пользователя
    if (user.value) {
      user.value.emailVerified = true
    }
    
    return true
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка подтверждения email'
    return false
  } finally {
    isLoading.value = false
  }
}

// Повторная отправка письма подтверждения
const resendVerification = async (emailData: ResendVerificationDto): Promise<boolean> => {
  isLoading.value = true
  error.value = null
  
  const apiConfig = useApiConfig()
  
  try {
    await $fetch(`${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.RESEND_VERIFICATION}`, {
      method: 'POST',
      body: emailData
    })
    
    return true
  } catch (err: any) {
    error.value = err.data?.message || 'Ошибка отправки письма подтверждения'
    return false
  } finally {
    isLoading.value = false
  }
}

// Очистка ошибки
const clearError = () => {
  error.value = null
}

// Инициализируем авторизацию при загрузке
if (process.client) {
  initializeAuth()
}

export const useAuth = () => {
  return {
    // Состояние
    user: readonly(user),
    token: readonly(token),
    isLoading: readonly(isLoading),
    error: readonly(error),
    isAuthenticated,
    isAdmin,
    isModerator,
    
    // Методы
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
    clearError,
    fetchUserProfile
  }
}
