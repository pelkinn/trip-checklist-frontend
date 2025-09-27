<template>
  <VContainer>
    <div v-if="pending" class="text-center py-8">
      <VProgressCircular indeterminate />
    </div>

    <div v-else>
      <div class="d-flex justify-space-between mb-15">
        <p class="text-h3">{{ checklist?.nameTripType }}</p>
      </div>
      <div class="grid">
        <div>
          <p class="mb-15">
            Дата создания:
            <span class="font-weight-bold">{{ formatDateTime(checklist?.createdAt) }}</span>
          </p>
        </div>
        <div class="w-100">
          <p class="text-h5 mb-6">Список вещей</p>

          <div v-for="item in checklist?.items" :key="item.id">
            <UserChecklistItem :id-checklist="checklist!.id" :item="item" public />
          </div>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
  const services = useServices();

  const route = useRoute();

  const { pending, data: checklist } = useLazyAsyncData(() => {
    return services.checklist.getUserChecklistPublic(route.params.token as string);
  });
</script>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: minmax(100px, 500px) 500px;
    gap: 16px;
  }
</style>
