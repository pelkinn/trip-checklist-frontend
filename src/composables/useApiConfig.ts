export const useApiConfig = () => {
  const config = useRuntimeConfig()

  return {
    BASE_URL: config.public.apiBaseUrl || 'https://api.trip-checklist.ru',
    TIMEOUT: 10000,
    ENDPOINTS: {
      AUTH: {
        LOGIN: '/auth/login',
        REGISTER: '/auth/register',
        ME: '/auth/me',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
        VERIFY_EMAIL: '/auth/verify-email',
        RESEND_VERIFICATION: '/auth/resend-verification',
        CREATE_ADMIN: '/auth/create-admin'
      }
    }
  }
}
