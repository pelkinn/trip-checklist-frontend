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
      },
      USER_CHECKLISTS: {
        LIST: '/user-checklist',
        CREATE: '/user-checklist',
        GET: '/user-checklist/:id',
        UPDATE: '/user-checklist/:id',
        DELETE: '/user-checklist/:id',
        ITEMS: {
          CREATE: '/user-checklist/:id/items',
          UPDATE: '/user-checklist/:id/items/:itemId',
          DELETE: '/user-checklist/:id/items/:itemId',
        },
      },
      CHECKLISTS: {
        GET_TEMPLATE: '/checklist',
        LIST_ALL: '/checklist/all',
      },
      TRIP_TYPES: {
        LIST: '/trip-type',
      },
      DURATIONS: {
        LIST: '/duration',
      },
    },
  }
}
