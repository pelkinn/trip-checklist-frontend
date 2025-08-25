import type {
  LoginDto,
  RegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ResendVerificationDto,
  AuthResponse,
  UserProfile,
  RegisterResponse,
} from '~/types/auth'

export const useAuthApi = () => {
  const apiConfig = useApiConfig()

  // Вход в систему
  const login = async (credentials: LoginDto): Promise<AuthResponse> => {
    return await $fetch<AuthResponse>(
      `${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.LOGIN}`,
      {
        method: 'POST',
        body: credentials,
      }
    )
  }

  // Регистрация
  const register = async (userData: RegisterDto): Promise<RegisterResponse> => {
    return await $fetch<RegisterResponse>(
      `${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.REGISTER}`,
      {
        method: 'POST',
        body: userData,
      }
    )
  }

  // Получение профиля пользователя
  const fetchUserProfile = async (token: string): Promise<UserProfile> => {
    return await $fetch<UserProfile>(
      `${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.ME}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }

  // Запрос сброса пароля
  const forgotPassword = async (
    emailData: ForgotPasswordDto
  ): Promise<void> => {
    return await $fetch(
      `${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      {
        method: 'POST',
        body: emailData,
      }
    )
  }

  // Сброс пароля
  const resetPassword = async (resetData: ResetPasswordDto): Promise<void> => {
    return await $fetch(
      `${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.RESET_PASSWORD}`,
      {
        method: 'POST',
        body: resetData,
      }
    )
  }

  // Подтверждение email
  const verifyEmail = async (verifyData: VerifyEmailDto): Promise<void> => {
    return await $fetch(
      `${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.VERIFY_EMAIL}`,
      {
        method: 'POST',
        body: verifyData,
      }
    )
  }

  // Повторная отправка письма подтверждения
  const resendVerification = async (
    emailData: ResendVerificationDto
  ): Promise<void> => {
    return await $fetch(
      `${apiConfig.BASE_URL}${apiConfig.ENDPOINTS.AUTH.RESEND_VERIFICATION}`,
      {
        method: 'POST',
        body: emailData,
      }
    )
  }

  return {
    login,
    register,
    fetchUserProfile,
    forgotPassword,
    resetPassword,
    verifyEmail,
    resendVerification,
  }
}
