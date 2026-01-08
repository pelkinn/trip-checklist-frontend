<template>
  <BaseDialogCard>
    <template #title>Создать из шаблона</template>
    <template #description>
      <VForm @submit.prevent="handleSubmit">
        <VAutocomplete
          v-model="form.tripTypeId"
          :items="tripTypes"
          label="Тип поездки"
          item-value="id"
          item-title="name"
          :loading="loadingTripTypes"
          class="mb-4"
          :error-messages="getErrorMessage(v$.tripTypeId)"
          @update:model-value="onTripTypeChange"
        />
        <VAutocomplete
          v-model="form.checklistId"
          :items="availableChecklists"
          label="Готовый чеклист"
          item-value="id"
          :item-title="(item) => item.name || item.tripTypeName"
          :loading="loadingChecklists"
          :disabled="!form.tripTypeId"
          :error-messages="getErrorMessage(v$.checklistId)"
        />
      </VForm>
    </template>
    <template #buttons>
      <VBtn variant="text" @click="emit('close')">Отменить</VBtn>
      <VBtn color="primary" :loading="loading" :disabled="!form.checklistId" @click="handleSubmit">Создать</VBtn>
    </template>
  </BaseDialogCard>
</template>

<script setup lang="ts">
  import { useVuelidate } from '@vuelidate/core';
  import { helpers, required } from '@vuelidate/validators';
  import type { ChecklistByTripType } from '~/types/checklist';
  import { getErrorMessage } from '~/utils/validator';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'created'): void;
  }>();

  const services = useServices();

  const checklistStore = useChecklistsStore();
  const { getTripTypes } = checklistStore;
  const { tripTypes } = storeToRefs(checklistStore);

  const loadingTripTypes = ref(false);

  onMounted(async () => {
    if (!tripTypes.value.length) {
      loadingTripTypes.value = true;
      try {
        await getTripTypes();
      } finally {
        loadingTripTypes.value = false;
      }
    }
  });

  const form = ref({
    tripTypeId: null as number | null,
    checklistId: null as number | null
  });

  const loading = ref(false);
  const loadingChecklists = ref(false);
  const availableChecklists = ref<ChecklistByTripType[]>([]);

  const rules = computed(() => ({
    tripTypeId: {
      required: helpers.withMessage('Обязательное поле', required)
    },
    checklistId: {
      required: helpers.withMessage('Обязательное поле', required)
    }
  }));

  const v$ = useVuelidate(rules, form);

  const onTripTypeChange = async (tripTypeId: number | null) => {
    form.value.checklistId = null;
    availableChecklists.value = [];

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

  // const onChecklistChange = async (checklistId: number | null) => {
  //   // Можно добавить загрузку деталей чеклиста для предпросмотра, но пока не требуется
  // };

  const handleSubmit = async () => {
    if (!(await v$.value.$validate())) {
      return;
    }

    if (!form.value.checklistId) {
      return;
    }

    loading.value = true;
    try {
      await services.checklist.createUserChecklist({
        checklistId: form.value.checklistId
      });
      emit('created');
      emit('close');
    } catch (err: any) {
      const { showErrorToast } = useToast();
      let message = 'Ошибка при создании чеклиста';
      if (err.response?._data?.message) {
        message = Array.isArray(err.response._data.message) ? err.response._data.message[0] : err.response._data.message;
      }
      showErrorToast(message);
      console.log(err);
    } finally {
      loading.value = false;
    }
  };
</script>
