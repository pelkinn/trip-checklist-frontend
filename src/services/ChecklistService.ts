import type { $Fetch } from 'nitropack';
import type { RuntimeConfig } from 'nuxt/schema';
import type {
  Checklist,
  ChecklistByTripType,
  CreateUserChecklist,
  TripType,
  UserChecklist,
  UserChecklistItem,
  UserChecklistItemBodyUpdate
} from '~/types/checklist';

export class ChecklistService {
  constructor(
    protected api: $Fetch,
    protected runtimeConfig: RuntimeConfig
  ) {}

  getTypes() {
    return this.api<TripType[]>(`/trip-type`);
  }

  getChecklistsByTripType(tripTypeId: number) {
    return this.api<ChecklistByTripType[]>(`/checklist/by-trip-type/${tripTypeId}`);
  }

  getChecklist(id: number) {
    return this.api<Checklist>(`/checklist/${id}`);
  }

  getUserChecklists() {
    return this.api<UserChecklist[]>('/user-checklist');
  }

  getUserChecklist(id: number) {
    return this.api<UserChecklist>(`/user-checklist/${id}`);
  }

  createUserChecklist(body: CreateUserChecklist) {
    return this.api<UserChecklist>('/user-checklist', {
      method: 'post',
      body
    });
  }

  removeUserChecklist(id: number) {
    return this.api(`/user-checklist/${id}`, {
      method: 'delete'
    });
  }

  updateUserChecklistItem(idChecklist: number, idItem: number, body: UserChecklistItemBodyUpdate) {
    return this.api(`/user-checklist/${idChecklist}/items/${idItem}`, {
      method: 'patch',
      body
    });
  }

  removeUserChecklistItem(idChecklist: number, idItem: number) {
    return this.api(`/user-checklist/${idChecklist}/items/${idItem}`, {
      method: 'delete'
    });
  }

  addUserChecklistItem(id: number, customName: string, order: number) {
    return this.api<UserChecklistItem>(`/user-checklist/${id}/items`, {
      method: 'post',
      body: {
        customName,
        order
      }
    });
  }

  togglePublic(id: number) {
    return this.api<UserChecklist>(`/user-checklist/${id}/toggle-share`, {
      method: 'post'
    });
  }

  getUserChecklistPublic(token: string) {
    return this.api<UserChecklist>(`/s/${token}`);
  }

  changeTitleUserChecklist(idChecklist: number, name: string) {
    return this.api(`/user-checklist/${idChecklist}`, {
      method: 'patch',
      body: {
        name
      }
    });
  }
}
