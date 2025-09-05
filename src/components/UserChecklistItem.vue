<template>
  <VCard class="pa-6" :to="`/checklists/${checklist.id}`">
    <p class="text-h5 mb-4">{{ checklist.nameTripType }}</p>
    <p>ID Чеклиста: {{ checklist.id }}</p>
    <p>Элементов: {{ checklist.items.length }}</p>
    <p>Длительность: {{ checklist.duration.label }}</p>
    <p>Дата создания: {{ formatDateTime(checklist.createdAt) }}</p>
  </VCard>
</template>

<script lang="ts" setup>
  import type { UserChecklist } from '~/types/checklist'

  defineProps<{ checklist: UserChecklist }>()
</script>
