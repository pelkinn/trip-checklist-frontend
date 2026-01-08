export interface Item {
  id: number;
  name: string;
}

export interface UserChecklistItem {
  id: number;
  customName: string | null;
  isChecked: boolean;
  item: Item;
  order: number;
}

export interface UserChecklist {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  nameTripType: string;
  publicToken: string | null;
  items: UserChecklistItem[];
  name: string;
}

export interface CreateUserChecklist {
  checklistId?: number;
  name?: string;
}

export interface TripType {
  id: number;
  name: string;
}

export interface UserChecklistsResponse {
  userChecklists: UserChecklist[];
  total: number;
  page: number;
  limit: number;
}

export interface TripTypesResponse {
  tripTypes: TripType[];
}

export interface UserChecklistItemBodyUpdate {
  idItem?: number;
  customName?: string;
  isChecked?: boolean;
  order?: number;
}

export interface ChecklistByTripType {
  id: number;
  name: string | null;
  tripTypeId: number;
  tripTypeName: string;
  itemsCount: number;
}

export interface Checklist {
  id: number;
  name: string | null;
  items: Item[];
}
