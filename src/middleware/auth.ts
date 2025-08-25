export default defineNuxtRouteMiddleware((to, from) => {
  // Проверяем, что мы на клиенте
  if (process.server) {
    return
  }

  const authStore = useAuthStore()

  // Получаем параметр из meta или query для определения типа проверки
  const requireAuth = to.meta.requireAuth !== false // по умолчанию требуется авторизация
  const redirectIfAuth = to.meta.redirectIfAuth || false // перенаправлять ли авторизованных пользователей

  // Если требуется авторизация и пользователь не авторизован
  if (requireAuth && !authStore.isAuthenticated) {
    return navigateTo('/auth')
  }

  // Если нужно перенаправить авторизованных пользователей
  if (redirectIfAuth && authStore.isAuthenticated) {
    return navigateTo('/')
  }
})
