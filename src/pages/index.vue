<template>
  <VContainer class="container">
    <div class="d-flex flex-column align-center">
      <div class="welcome-content">
        <h1 class="text-primary">Trip Checklist</h1>
        <p>
          Зарегистрируйтесь, чтобы создавать удобные чек-листы для любых поездок: выбирайте готовые шаблоны под разные типы путешествий и
          продолжительность, добавляйте свои пункты и отслеживайте прогресс сборов
        </p>
      </div>

      <div v-if="pending" class="d-flex justify-center">
        <VProgressCircular indeterminate />
      </div>

      <VCard v-else class="search" elevation="4">
        <VAutocomplete
          v-model="searchForm.tripTypeId"
          :options="tripTypes"
          label="Тип поездки"
          :items="tripTypes"
          item-value="id"
          item-title="name"
          :loading="loadingSearch"
        />
      </VCard>

      <div v-if="loadingSearch" class="d-flex justify-center">
        <VProgressCircular indeterminate />
      </div>

      <div v-else-if="checklistActive.items.length > 0">
        <VList class="mb-6">
          <VListItem v-for="item in checklistActive?.items" :key="item.id" class="template-item">
            <span class="font-weight-medium">{{ item.name }}</span>
          </VListItem>
        </VList>

        <VBtn :loading="loadingCreateChecklist" @click="createUserChecklist"> Скопировать к себе </VBtn>
      </div>

      <img v-else src="/assets/images/img4.webp" alt="" class="img" />
    </div>
  </VContainer>
</template>

<script setup lang="ts">
  import type { Item } from '~/types/checklist';

  const checklistStore = useChecklistsStore();
  const { getTripTypes } = checklistStore;
  const { tripTypes } = storeToRefs(checklistStore);

  const { user } = storeToRefs(useUserStore());

  const { pending } = await useLazyAsyncData(() => {
    return getTripTypes();
  });

  const { showInfoToast } = useToast();

  const services = useServices();

  const searchForm = ref({
    tripTypeId: null
  });

  const loadingSearch = ref(false);

  const checklistActive = ref<{ id: number; items: Item[] }>({
    id: 0,
    items: []
  });

  const searchTemplate = async () => {
    if (!searchForm.value.tripTypeId) return;

    loadingSearch.value = true;

    try {
      checklistActive.value = await services.checklist.getChecklist(searchForm.value.tripTypeId);
    } catch {
      checklistActive.value = {
        id: 0,
        items: []
      };
    } finally {
      loadingSearch.value = false;
    }
  };

  const loadingCreateChecklist = ref(false);

  const createUserChecklist = async () => {
    if (!user.value) {
      showInfoToast('Войдите в систему');
      return;
    }

    loadingCreateChecklist.value = true;

    try {
      const res = await services.checklist.createUserChecklist({
        checklistId: checklistActive.value.id
      });
      navigateTo(`/checklists/${res.id}`);
    } catch (err: any) {
      console.log(err);
    } finally {
      loadingCreateChecklist.value = false;
    }
  };

  useHead({
    title: 'Trip Checklist - Персональные чеклисты путешествий',
    meta: [
      {
        name: 'description',
        content: 'Создавайте персональные чеклисты для ваших путешествий'
      }
    ]
  });

  watch(
    () => searchForm.value.tripTypeId,
    () => {
      searchTemplate();
    }
  );
</script>

<style scoped>
  .welcome-content {
    max-width: 650px;
    text-align: center;
    margin-bottom: 32px;
  }

  .search {
    width: 100%;
    max-width: 650px;
    padding: 24px;
    margin-bottom: 32px;
  }

  .img {
    max-width: 500px;
    width: 100%;
  }
</style>
