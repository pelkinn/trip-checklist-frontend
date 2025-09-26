import { defineStore } from 'pinia';
import type { TripType } from '~/types/checklist';

export const useChecklistsStore = defineStore('checklists', () => {
  const services = useServices();

  const tripTypes = ref<TripType[]>([]);

  const getTripTypes = async () => {
    tripTypes.value = await services.checklist.getTypes();
  };

  return {
    tripTypes,
    getTripTypes
  };
});
