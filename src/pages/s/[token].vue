<template>
  <VContainer>
    <div v-if="pending" class="text-center py-8">
      <VProgressCircular indeterminate />
    </div>

    <div v-else-if="error || !checklist" class="d-flex flex-column align-center justify-center py-16">
      <VIcon :icon="mdiLockOutline" color="grey" size="64" class="mb-6" />
      <p class="text-h5 mb-2">Доступ к чеклисту закрыт</p>
      <p class="text-body-1 text-grey">Владелец чеклиста ограничил доступ к этому списку</p>
    </div>

    <div v-else>
      <VAlert type="info" variant="tonal" class="mb-6" :icon="mdiInformationOutline">
        Вы просматриваете чеклист в режиме только для чтения. Редактирование недоступно.
      </VAlert>

      <div class="d-flex justify-space-between mb-15">
        <p class="text-h3">{{ checklist.name || checklist.nameTripType }}</p>
      </div>

      <div>
        <p class="text-h5 mb-6">Список вещей</p>

        <div v-for="item in checklist.items" :key="item.id">
          <UserChecklistItem :id-checklist="checklist.id" :item="item" public />
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
  import { mdiInformationOutline, mdiLockOutline } from '@mdi/js';

  const services = useServices();

  const route = useRoute();

  const {
    pending,
    data: checklist,
    error
  } = useLazyAsyncData(() => {
    return services.checklist.getUserChecklistPublic(route.params.token as string);
  });
</script>
