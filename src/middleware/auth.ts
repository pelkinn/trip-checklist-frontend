export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  // Если пользователь не авторизован, перенаправляем на страницу авторизации
  if (!isAuthenticated.value) {
    return navigateTo('/auth')
  }
})
