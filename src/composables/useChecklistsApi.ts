import type {
  CreateUserChecklistDto,
  DurationDto,
  ItemDto,
  TripTypeDto,
  UserChecklist,
  UserChecklistItem,
} from '~/types/checklist'

export const useChecklistsApi = () => {
  const apiConfig = useApiConfig()

  // Загрузка чеклистов пользователя
  const fetchUserChecklists = async (
    token: string
  ): Promise<UserChecklist[]> => {
    return await $fetch<UserChecklist[]>(
      `${apiConfig.BASE_URL}/user-checklist`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }

  // Загрузка типов поездок
  const fetchTripTypes = async (): Promise<TripTypeDto[]> => {
    return await $fetch<TripTypeDto[]>(`${apiConfig.BASE_URL}/trip-type`)
  }

  // Загрузка длительностей
  const fetchDurations = async (): Promise<DurationDto[]> => {
    return await $fetch<DurationDto[]>(`${apiConfig.BASE_URL}/duration`)
  }

  const fetchTemplateChecklist = async (
    tripTypeId: number,
    durationId: number
  ): Promise<{ id: number; items: ItemDto[] }> => {
    return await $fetch(`${apiConfig.BASE_URL}/checklist`, {
      params: { tripTypeId, durationId },
    })
  }

  // Создание пользовательского чеклиста
  const createUserChecklist = async (
    data: CreateUserChecklistDto,
    token: string
  ): Promise<UserChecklist> => {
    return await $fetch<UserChecklist>(`${apiConfig.BASE_URL}/user-checklist`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    })
  }

  // Удаление чеклиста
  const deleteUserChecklist = async (
    id: number,
    token: string
  ): Promise<void> => {
    return await $fetch(`${apiConfig.BASE_URL}/user-checklist/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  // Загрузка конкретного чеклиста
  const fetchChecklist = async (
    id: number,
    token: string
  ): Promise<UserChecklist> => {
    return await $fetch<UserChecklist>(
      `${apiConfig.BASE_URL}/user-checklist/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  }

  // Обновление элемента чеклиста
  const updateChecklistItem = async (
    checklistId: number,
    itemId: number,
    updates: Partial<UserChecklistItem>,
    token: string
  ): Promise<UserChecklistItem> => {
    return await $fetch<UserChecklistItem>(
      `${apiConfig.BASE_URL}/user-checklist/${checklistId}/items/${itemId}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: updates,
      }
    )
  }

  return {
    fetchUserChecklists,
    fetchTripTypes,
    fetchDurations,
    fetchTemplateChecklist,
    createUserChecklist,
    deleteUserChecklist,
    fetchChecklist,
    updateChecklistItem,
  }
}
