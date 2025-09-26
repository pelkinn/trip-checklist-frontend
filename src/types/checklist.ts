export interface Item {
  id: number;
  name: string;
}

export interface UserChecklistItem {
  id: number;
  customName: string | null;
  isChecked: boolean;
  item: Item;
}

export interface UserChecklist {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  nameTripType: string;
  items: UserChecklistItem[];
}

export interface CreateUserChecklist {
  checklistId: number;
}

export interface TripType {
  id: number;
  name: string;
}

export interface GetTemplateChecklist {
  tripTypeId: number;
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
  itemId?: number;
  customName?: string;
  isChecked?: boolean;
}
