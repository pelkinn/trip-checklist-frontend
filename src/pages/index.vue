<template>
  <VContainer class="container">
    <div class="d-flex flex-column align-center">
      <div class="welcome-content">
        <h1 class="text-primary">Trip Checklist</h1>
        <p>
          {{
            user
              ? 'Создавайте удобные чек-листы для любых поездок: выбирайте готовые шаблоны под разные типы путешествий и продолжительность, добавляйте свои пункты и отслеживайте прогресс сборов'
              : 'Зарегистрируйтесь, чтобы создавать удобные чек-листы для любых поездок: выбирайте готовые шаблоны под разные типы путешествий и продолжительность, добавляйте свои пункты и отслеживайте прогресс сборов'
          }}
        </p>
      </div>

      <div v-if="loadingTripTypes" class="d-flex justify-center">
        <VProgressCircular indeterminate />
      </div>

      <VCard v-else class="search" elevation="4">
        <div class="d-flex flex-column gap-4">
          <VAutocomplete
            v-model="searchForm.tripTypeId"
            :options="tripTypes"
            label="Тип мероприятия"
            :items="tripTypes"
            item-value="id"
            item-title="name"
            :loading="loadingTripTypes"
            class="mb-4"
            @update:model-value="onTripTypeChange"
          />
          <VAutocomplete
            v-model="searchForm.checklistId"
            :items="availableChecklists"
            label="Чеклист"
            item-value="id"
            :item-title="
              (item) => (item.name ? `${item.name} (${item.itemsCount} пунктов)` : `${item.tripTypeName} (${item.itemsCount} пунктов)`)
            "
            :loading="loadingChecklists"
            :disabled="!searchForm.tripTypeId"
            @update:model-value="onChecklistChange"
          />
        </div>
      </VCard>

      <div v-if="loadingChecklists || loadingChecklistDetails" class="d-flex justify-center">
        <VProgressCircular indeterminate />
      </div>

      <div v-else-if="checklistDetails">
        <VBtn :loading="loadingCreateChecklist" block class="mb-6" @click="createUserChecklist"> Скопировать к себе </VBtn>
        <VList class="mb-6">
          <VListItem v-for="item in checklistDetails.items" :key="item.id" class="template-item">
            <span class="font-weight-medium">{{ item.name }}</span>
          </VListItem>
        </VList>
      </div>

      <img v-else src="/assets/images/img4.webp" alt="" class="img" />
    </div>
  </VContainer>
</template>

<script setup lang="ts">
  import type { Checklist, ChecklistByTripType } from '~/types/checklist';

  const checklistStore = useChecklistsStore();
  const { getTripTypes } = checklistStore;
  const { tripTypes } = storeToRefs(checklistStore);

  const { user } = storeToRefs(useUserStore());

  const { pending: loadingTripTypes } = await useLazyAsyncData(() => {
    return getTripTypes();
  });

  const { showInfoToast } = useToast();

  const services = useServices();

  const searchForm = ref({
    tripTypeId: null as number | null,
    checklistId: null as number | null
  });

  const loadingChecklists = ref(false);
  const loadingChecklistDetails = ref(false);
  const availableChecklists = ref<ChecklistByTripType[]>([]);
  const checklistDetails = ref<Checklist | null>(null);

  const onTripTypeChange = async (tripTypeId: number | null) => {
    searchForm.value.checklistId = null;
    availableChecklists.value = [];
    checklistDetails.value = null;

    if (!tripTypeId) return;

    loadingChecklists.value = true;
    try {
      availableChecklists.value = await services.checklist.getChecklistsByTripType(tripTypeId);
    } catch {
      availableChecklists.value = [];
    } finally {
      loadingChecklists.value = false;
    }
  };

  const onChecklistChange = async (checklistId: number | null) => {
    checklistDetails.value = null;

    if (!checklistId) return;

    loadingChecklistDetails.value = true;
    try {
      checklistDetails.value = await services.checklist.getChecklist(checklistId);
    } catch {
      checklistDetails.value = null;
    } finally {
      loadingChecklistDetails.value = false;
    }
  };

  const loadingCreateChecklist = ref(false);

  const createUserChecklist = async () => {
    if (!user.value) {
      showInfoToast('Войдите в систему');
      return;
    }

    if (!searchForm.value.checklistId) {
      showInfoToast('Выберите чеклист');
      return;
    }

    loadingCreateChecklist.value = true;

    try {
      const res = await services.checklist.createUserChecklist({
        checklistId: searchForm.value.checklistId
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
