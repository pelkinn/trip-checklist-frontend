<template>
  <div class="checklists-page">
    <VContainer>
      <div class="d-flex justify-space-between mb-10">
        <h1>Мои чеклисты</h1>
      </div>

      <div v-if="pending" class="text-center py-8">
        <VProgressCircular indeterminate />
      </div>

      <div
        v-else-if="data && !data.length"
        class="d-flex flex-column align-center"
      >
        <div>📋</div>
        <h2>У вас пока нет чеклистов</h2>
        <p>
          Создайте свой первый чеклист для путешествия, выбрав тип поездки и
          длительность
        </p>
      </div>

      <div v-else class="checklists-grid">
        <UserChecklistItem
          v-for="checklist in data"
          :key="checklist.id"
          :checklist="checklist"
        />
      </div>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  })

  const services = useServices()

  const { pending, data } = useLazyAsyncData(() => {
    return services.checklist.getUserChecklists()
  })
</script>

<style scoped>
  .checklists-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
  }
</style>
