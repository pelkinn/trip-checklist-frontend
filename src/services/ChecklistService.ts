import type { $Fetch } from 'nitropack'
import type { RuntimeConfig } from 'nuxt/schema'
import type {
  CreateUserChecklist,
  Duration,
  Item,
  TripType,
  UserChecklist,
  UserChecklistItemBodyUpdate,
} from '~/types/checklist'

export class ChecklistService {
  constructor(
    protected api: $Fetch,
    protected runtimeConfig: RuntimeConfig
  ) {}

  getTypes() {
    return this.api<TripType[]>(`/trip-type`)
  }

  getDurations() {
    return this.api<Duration[]>(`/duration`)
  }

  getChecklist(tripTypeId: number, durationId: number) {
    return this.api<{ id: number; items: Item[] }>('/checklist', {
      params: { tripTypeId, durationId },
    })
  }

  getUserChecklists() {
    return this.api<UserChecklist[]>('/user-checklist')
  }

  getUserChecklist(id: number) {
    return this.api<UserChecklist>(`/user-checklist/${id}`)
  }

  createUserChecklist(body: CreateUserChecklist) {
    return this.api<UserChecklist>('/user-checklist', {
      method: 'post',
      body,
    })
  }

  removeUserChecklist(id: number) {
    return this.api(`/user-checklist/${id}`, {
      method: 'delete',
    })
  }

  updateUserChecklistItem(
    idChecklist: number,
    itemId: number,
    body: UserChecklistItemBodyUpdate
  ) {
    return this.api(`/user-checklist/${idChecklist}/items/${itemId}`, {
      method: 'patch',
      body,
    })
  }
}
