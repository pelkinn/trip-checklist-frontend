<template>
  <VContainer>
    <div v-if="pending" class="text-center py-8">
      <VProgressCircular indeterminate />
    </div>

    <div v-else>
      <div class="d-flex justify-space-between mb-15">
        <p class="text-h3">{{ checklist?.name || checklist?.nameTripType }}</p>
      </div>

      <div class="pl-16">
        <p class="text-h5 mb-6">Список вещей</p>

        <div v-for="item in checklist?.items" :key="item.id">
          <UserChecklistItem :id-checklist="checklist!.id" :item="item" public />
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
