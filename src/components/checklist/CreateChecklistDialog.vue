<template>
  <BaseDialogCard>
    <template #title>Создать новый чеклист</template>
    <template #description>
      <VForm @submit.prevent="handleSubmit">
        <VTextField v-model="v$.name.$model" label="Название" :error-messages="getErrorMessage(v$.name)" autofocus />
      </VForm>
    </template>
    <template #buttons>
      <VBtn variant="text" @click="emit('close')">Отменить</VBtn>
      <VBtn color="primary" :loading="loading" @click="handleSubmit">Создать</VBtn>
    </template>
  </BaseDialogCard>
</template>

<script setup lang="ts">
  import { useVuelidate } from '@vuelidate/core';
  import { helpers, required } from '@vuelidate/validators';
  import { getErrorMessage } from '~/utils/validator';

  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'created'): void;
  }>();

  const services = useServices();

  const form = ref({
    name: ''
  });

  const loading = ref(false);

  const rules = computed(() => ({
    name: {
      required: helpers.withMessage('Обязательное поле', required)
    }
  }));

  const v$ = useVuelidate(rules, form);

  const handleSubmit = async () => {
    if (!(await v$.value.$validate())) {
      return;
    }

    loading.value = true;
    try {
      await services.checklist.createUserChecklist({
        name: form.value.name
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
