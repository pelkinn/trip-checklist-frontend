import { defineStore } from 'pinia'
import type {
  UserChecklist,
  UserChecklistItem,
  TripTypeDto,
  DurationDto,
  ItemDto,
  CreateUserChecklistDto,
} from '~/types/checklist'

export const useChecklistsStore = defineStore('checklists', () => {
  // State
  const userChecklists = ref<UserChecklist[]>([])
  const tripTypes = ref<TripTypeDto[]>([])
  const durations = ref<DurationDto[]>([])
  const templateItems = ref<ItemDto[]>([])
  const currentChecklist = ref<UserChecklist | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasChecklists = computed(() => userChecklists.value.length > 0)
  const hasTripTypes = computed(() => tripTypes.value.length > 0)
  const hasDurations = computed(() => durations.value.length > 0)
  const hasTemplateItems = computed(() => templateItems.value.length > 0)

  // Получение названия типа поездки по ID
  const getTripTypeName = (id: number) => {
    const tripType = tripTypes.value.find(type => type.id === id)
    return tripType ? tripType.name : `Тип #${id}`
  }

  // Получение названия длительности по ID
  const getDurationLabel = (id: number) => {
    const duration = durations.value.find(d => d.id === id)
    return duration ? duration.label : `Длительность #${id}`
  }

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

  // Загрузка шаблонного чеклиста
  const fetchTemplateChecklist = async (
    tripTypeId: number,
    durationId: number
  ) => {
    isLoading.value = true
    error.value = null

    try {
      const checklistsApi = useChecklistsApi()
      const data = await checklistsApi.fetchTemplateChecklist(
        tripTypeId,
        durationId
      )
      templateItems.value = data
    } catch (err: any) {
      // Проверяем, является ли это ошибкой "не найдено" (404)
      if (err.status === 404 || err.data?.message?.includes('не найден')) {
        templateItems.value = []
        throw { notFound: true }
      } else {
        // Это реальная ошибка
        error.value = err.data?.message || 'Ошибка загрузки шаблона'
        templateItems.value = []
      }
    } finally {
      isLoading.value = false
    }
  }

  // Создание пользовательского чеклиста
  const createUserChecklist = async (data: CreateUserChecklistDto) => {
    isLoading.value = true
    error.value = null

    try {
      const authStore = useAuthStore()
      const checklistsApi = useChecklistsApi()

      const responseData = await checklistsApi.createUserChecklist(
        data,
        authStore.token!
      )
      userChecklists.value.push(responseData)
      return responseData
    } catch (err: any) {
      error.value = err.data?.message || 'Ошибка создания чеклиста'
    } finally {
      isLoading.value = false
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

  // Очистка текущего чеклиста
  const clearCurrentChecklist = () => {
    currentChecklist.value = null
    templateItems.value = []
  }

  // Очистка ошибки
  const clearError = () => {
    error.value = null
  }

  return {
    // State
    userChecklists,
    tripTypes,
    durations,
    templateItems,
    currentChecklist,
    isLoading,
    error,

    // Computed
    hasChecklists,
    hasTripTypes,
    hasDurations,
    hasTemplateItems,

    // Functions
    getTripTypeName,
    getDurationLabel,
    getCompletedItems,
    fetchUserChecklists,
    fetchTripTypes,
    fetchDurations,
    fetchTemplateChecklist,
    createUserChecklist,
    deleteUserChecklist,
    fetchChecklist,
    updateChecklistItem,
    clearCurrentChecklist,
    clearError,
  }
})
