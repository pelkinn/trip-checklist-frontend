import type { $Fetch } from 'nitropack'
import type { RuntimeConfig } from 'nuxt/schema'
import type {
  CreateUserChecklist,
  Duration,
  Item,
  TripType,
  UserChecklist,
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
    return this.api<Duration[]>(`/trip-type`)
  }

  getChecklists(tripTypeId: number, durationId: number) {
    return this.api<{ id: number; items: Item[] }>('/checklist', {
      params: { tripTypeId, durationId },
    })
  }

  createUserChecklist(body: CreateUserChecklist) {
    return this.api<UserChecklist>('/user-checklist', {
      method: 'post',
      body,
    })
  }
}
