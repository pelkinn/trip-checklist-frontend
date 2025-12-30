<template>
  <div class="checklists-page">
    <VContainer>
      <div class="d-flex justify-space-between mb-10">
        <h1 class="text-h4">Мои чеклисты</h1>
        <VBtn color="primary" @click="openCreateDialog">Создать новый</VBtn>
      </div>

      <div v-if="pending" class="text-center py-8">
        <VProgressCircular indeterminate />
      </div>

      <div v-else-if="data && !data.length" class="d-flex flex-column align-center">
        <p class="text-h6 mb-2">У вас пока нет чеклистов</p>
        <p>Создайте свой первый чеклист для путешествия, выбрав тип поездки</p>
      </div>

      <div v-else class="checklists-grid">
        <UserChecklist v-for="checklist in data" :key="checklist.id" :checklist="checklist" />
      </div>
    </VContainer>
  </div>
</template>

<script setup lang="ts">
  import { LazyChecklistCreateChecklistDialog } from '#components';

  definePageMeta({
    middleware: 'auth'
  });

  const services = useServices();

  const { pending, data, refresh } = useLazyAsyncData(() => {
    return services.checklist.getUserChecklists();
  });

  const { openDialog } = useDialog();

  const openCreateDialog = () => {
    openDialog({
      component: LazyChecklistCreateChecklistDialog,
      listeners: {
        created: () => {
          refresh();
        }
      }
    });
  };
</script>

<style scoped lang="scss">
  .checklists-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @media #{map.get(v.$display-breakpoints, 'sm-and-up')} {
      grid-template-columns: 1fr 1fr;
    }

    @media #{map.get(v.$display-breakpoints, 'md-and-up')} {
      grid-template-columns: 1fr 1fr 1fr;
    }
  }
</style>
