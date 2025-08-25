// Типы для глобальных элементов чеклистов
export interface ItemDto {
  id: number
  name: string
}

// Типы для пользовательских чеклистов
export interface UserChecklistItem {
  id: number
  item_id?: number
  custom_name?: string
  is_checked: boolean
  created_at: string
  updated_at: string
}

export interface UserChecklist {
  id: number
  checklist_id: number
  user_id: number
  items: UserChecklistItem[]
  created_at: string
  updated_at: string
}

// DTO для создания пользовательского чеклиста
export interface CreateUserChecklistDto {
  checklist_id: number
  items: number[]
  user_id: number
}

// DTO для обновления пользовательского чеклиста
export interface UpdateUserChecklistDto {
  items: number[]
}

// DTO для создания элемента пользовательского чеклиста
export interface CreateUserChecklistItemDto {
  item_id?: number
  custom_name?: string
  is_checked?: boolean
}

// DTO для обновления элемента пользовательского чеклиста
export interface UpdateUserChecklistItemDto {
  item_id?: number
  custom_name?: string
  is_checked?: boolean
}

// Типы для шаблонных чеклистов
export interface TripTypeDto {
  id: number
  name: string
}

export interface DurationDto {
  id: number
  days: number
  label: string
}

// DTO для получения шаблонного чеклиста
export interface GetTemplateChecklistDto {
  tripTypeId: number
  durationId: number
}

// Ответы API
export interface UserChecklistResponse {
  userChecklist: UserChecklist
}

export interface UserChecklistsResponse {
  userChecklists: UserChecklist[]
  total: number
  page: number
  limit: number
}

export interface TripTypesResponse {
  tripTypes: TripTypeDto[]
}

export interface DurationsResponse {
  durations: DurationDto[]
}
