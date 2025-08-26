<template>
  <VCard class="pa-6">
    <p>ID Чеклиста: {{ checklist.checklistId }}</p>
    <p>Элементов: {{ checklist.items.length }}</p>
  </VCard>
</template>

<script lang="ts" setup>
  import type { UserChecklist } from '~/types/checklist'

  defineProps<{ checklist: UserChecklist }>()
</script>
