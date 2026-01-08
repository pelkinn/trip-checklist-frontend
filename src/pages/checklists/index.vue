<template>
  <div class="checklists-page">
    <VContainer>
      <div class="d-flex flex-column flex-md-row justify-space-between mb-10">
        <h1 class="text-h4 mb-4 mb-md-0">Мои чеклисты</h1>
        <div class="d-flex flex-column flex-md-row gap-2">
          <VBtn class="mb-2 mb-md-0 mr-md-2" variant="outlined" @click="openCreateEmptyDialog">Создать пустой</VBtn>
          <VBtn color="primary" @click="openCreateFromTemplateDialog">Создать из шаблона</VBtn>
        </div>
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
  import { LazyChecklistCreateChecklistDialog, LazyChecklistCreateChecklistFromTemplateDialog } from '#components';

  definePageMeta({
    middleware: 'auth'
  });

  const services = useServices();

  const { pending, data, refresh } = useLazyAsyncData(() => {
    return services.checklist.getUserChecklists();
  });

  const { openDialog } = useDialog();

  const openCreateEmptyDialog = () => {
    openDialog({
      component: LazyChecklistCreateChecklistDialog,
      listeners: {
        created: () => {
          refresh();
        }
      }
    });
  };

  const openCreateFromTemplateDialog = () => {
    openDialog({
      component: LazyChecklistCreateChecklistFromTemplateDialog,
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
