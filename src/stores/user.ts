import { defineStore } from 'pinia'
import type { UserProfile } from '~/types/auth'

export const useUserStore = defineStore('auth', () => {
  const services = useServices()

  const user = ref<UserProfile | null>(null)

  const logout = () => {
    user.value = null
  }

  const getUser = async () => {
    user.value = await services.auth.me()
  }

  return {
    user,
    logout,
    getUser,
  }
})
