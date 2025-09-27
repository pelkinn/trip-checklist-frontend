import type { $Fetch } from 'nitropack';
import type { RuntimeConfig } from 'nuxt/schema';
import type { CreateUserChecklist, Item, TripType, UserChecklist, UserChecklistItem, UserChecklistItemBodyUpdate } from '~/types/checklist';

export class ChecklistService {
  constructor(
    protected api: $Fetch,
    protected runtimeConfig: RuntimeConfig
  ) {}

  getTypes() {
    return this.api<TripType[]>(`/trip-type`);
  }

  getChecklist(tripTypeId: number) {
    return this.api<{ id: number; items: Item[] }>('/checklist', {
      params: { tripTypeId }
    });
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

  addUserChecklistItem(id: number, customName: string) {
    return this.api<UserChecklistItem>(`/user-checklist/${id}/items`, {
      method: 'post',
      body: {
        customName
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
}
