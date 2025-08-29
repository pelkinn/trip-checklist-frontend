// Типы для глобальных элементов чеклистов
export interface Item {
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
  checklistId: number
  userId: number
  items: UserChecklistItem[]
  created_at: string
  updated_at: string
}

// DTO для создания пользовательского чеклиста
export interface CreateUserChecklist {
  checklistId: number
}

// DTO для обновления пользовательского чеклиста
export interface UpdateUserChecklist {
  items: number[]
}

// DTO для создания элемента пользовательского чеклиста
export interface CreateUserChecklistItem {
  item_id?: number
  custom_name?: string
  is_checked?: boolean
}

// DTO для обновления элемента пользовательского чеклиста
export interface UpdateUserChecklistItem {
  item_id?: number
  custom_name?: string
  is_checked?: boolean
}

// Типы для шаблонных чеклистов
export interface TripType {
  id: number
  name: string
}

export interface Duration {
  id: number
  days: number
  label: string
}

// DTO для получения шаблонного чеклиста
export interface GetTemplateChecklist {
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
  tripTypes: TripType[]
}

export interface DurationsResponse {
  durations: Duration[]
}
