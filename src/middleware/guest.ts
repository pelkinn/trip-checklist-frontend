export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAuth()
  
  // Если пользователь авторизован, перенаправляем на главную
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})
