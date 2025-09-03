import { defineStore } from 'pinia'
import type { Duration, TripType } from '~/types/checklist'

export const useChecklistsStore = defineStore('checklists', () => {
  const services = useServices()

  const tripTypes = ref<TripType[]>([])
  const durations = ref<Duration[]>([])

  const getTripTypes = async () => {
    tripTypes.value = await services.checklist.getTypes()
  }

  const getDurations = async () => {
    durations.value = await services.checklist.getDurations()
  }

  return {
    tripTypes,
    durations,
    getTripTypes,
    getDurations,
  }
})
