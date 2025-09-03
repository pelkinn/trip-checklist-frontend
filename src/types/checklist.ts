export interface Item {
  id: number
  name: string
}

export interface UserChecklistItem {
  id: number
  customName: string | null
  isChecked: boolean
  item: Item
}

export interface UserChecklist {
  id: number
  createdAt: string
  updatedAt: string | null
  checklistId: number
  checklist: {
    id: number
    tripType: TripType
    duration: Duration
  }
  items: UserChecklistItem[]
}

export interface CreateUserChecklist {
  checklistId: number
}

export interface TripType {
  id: number
  name: string
}

export interface Duration {
  id: number
  days: number
  label: string
}

export interface GetTemplateChecklist {
  tripTypeId: number
  durationId: number
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
