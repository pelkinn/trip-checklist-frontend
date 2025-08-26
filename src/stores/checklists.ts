import { defineStore } from 'pinia'
import type {
  DurationDto,
  TripTypeDto,
  UserChecklist,
  UserChecklistItem,
} from '~/types/checklist'

export const useChecklistsStore = defineStore('checklists', () => {
  // State
  const userChecklists = ref<UserChecklist[]>([])
  const tripTypes = ref<TripTypeDto[]>([])
  const durations = ref<DurationDto[]>([])
  const currentChecklist = ref<UserChecklist | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Подсчет выполненных элементов в чеклисте
  const getCompletedItems = (checklist: UserChecklist) => {
    return checklist.items.filter(item => item.is_checked).length
  }

  // Actions
  // Загрузка чеклистов пользователя
  const fetchUserChecklists = async () => {
    isLoading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      const checklistsApi = useChecklistsApi()

      const data = await checklistsApi.fetchUserChecklists(authStore.token!)
      userChecklists.value = data
    } catch (err: any) {
      error.value = err.data?.message || 'Ошибка загрузки чеклистов'
    } finally {
      isLoading.value = false
    }
  }

  // Загрузка типов поездок
  const fetchTripTypes = async () => {
    try {
      const checklistsApi = useChecklistsApi()
      const data = await checklistsApi.fetchTripTypes()
      tripTypes.value = data
    } catch (err: any) {
      error.value = err.data?.message || 'Ошибка загрузки типов поездок'
    }
  }

  // Загрузка длительностей
  const fetchDurations = async () => {
    try {
      const checklistsApi = useChecklistsApi()
      const data = await checklistsApi.fetchDurations()
      durations.value = data
    } catch (err: any) {
      error.value = err.data?.message || 'Ошибка загрузки длительностей'
    }
  }

  // Удаление чеклиста
  const deleteUserChecklist = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      const checklistsApi = useChecklistsApi()

      await checklistsApi.deleteUserChecklist(id, authStore.token!)
      userChecklists.value = userChecklists.value.filter(
        checklist => checklist.id !== id
      )
    } catch (err: any) {
      error.value = err.data?.message || 'Ошибка удаления чеклиста'
    } finally {
      isLoading.value = false
    }
  }

  // Загрузка конкретного чеклиста
  const fetchChecklist = async (id: number) => {
    isLoading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      const checklistsApi = useChecklistsApi()

      const data = await checklistsApi.fetchChecklist(id, authStore.token!)
      currentChecklist.value = data
      return data
    } catch (err: any) {
      error.value = err.data?.message || 'Ошибка загрузки чеклиста'
    } finally {
      isLoading.value = false
    }
  }

  // Обновление элемента чеклиста
  const updateChecklistItem = async (
    checklistId: number,
    itemId: number,
    updates: Partial<UserChecklistItem>
  ) => {
    try {
      const authStore = useAuthStore()
      const checklistsApi = useChecklistsApi()

      const updatedItem = await checklistsApi.updateChecklistItem(
        checklistId,
        itemId,
        updates,
        authStore.token!
      )

      // Обновляем элемент в текущем чеклисте
      if (currentChecklist.value && currentChecklist.value.id === checklistId) {
        const itemIndex = currentChecklist.value.items.findIndex(
          item => item.id === itemId
        )
        if (itemIndex !== -1) {
          currentChecklist.value.items[itemIndex] = {
            ...currentChecklist.value.items[itemIndex],
            ...updatedItem,
          }
        }
      }

      // Обновляем элемент в списке чеклистов
      const checklistIndex = userChecklists.value.findIndex(
        checklist => checklist.id === checklistId
      )
      if (checklistIndex !== -1) {
        const itemIndex = userChecklists.value[checklistIndex].items.findIndex(
          item => item.id === itemId
        )
        if (itemIndex !== -1) {
          userChecklists.value[checklistIndex].items[itemIndex] = {
            ...userChecklists.value[checklistIndex].items[itemIndex],
            ...updatedItem,
          }
        }
      }

      return updatedItem
    } catch (err: any) {
      error.value = err.data?.message || 'Ошибка обновления элемента'
    }
  }

  return {
    // State
    userChecklists,
    tripTypes,
    durations,
    currentChecklist,
    isLoading,
    error,

    getCompletedItems,
    fetchUserChecklists,
    fetchTripTypes,
    fetchDurations,
    deleteUserChecklist,
    fetchChecklist,
    updateChecklistItem,
    clearError,
  }
})
