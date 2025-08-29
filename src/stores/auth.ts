import { defineStore } from 'pinia'
import type { UserProfile } from '~/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null)

  const logout = () => {
    user.value = null
  }

  return {
    user,
    logout,
  }
})
