<template>
  <BaseDialogCard>
    <template #title>Обратная связь</template>
    <template #description>
      <VForm @submit.prevent="handleSubmit">
        <VTextField v-model="v$.email.$model" label="Email" type="email" :error-messages="getErrorMessage(v$.email)" autofocus />

        <VTextField v-model="v$.subject.$model" label="Тема" :error-messages="getErrorMessage(v$.subject)" />

        <VTextarea v-model="v$.message.$model" label="Сообщение" :error-messages="getErrorMessage(v$.message)" rows="6" auto-grow />
      </VForm>
    </template>
    <template #buttons>
      <VBtn variant="text" @click="emit('close')">Отменить</VBtn>
      <VBtn color="primary" :loading="loading" @click="handleSubmit">Отправить</VBtn>
    </template>
  </BaseDialogCard>
</template>

<script setup lang="ts">
  import useVuelidate from '@vuelidate/core';
  import { email, helpers, maxLength, minLength, required } from '@vuelidate/validators';
  import { getErrorMessage } from '~/utils/validator';

  const emit = defineEmits<{
    (e: 'close'): void;
  }>();

  const services = useServices();
  const { showSuccessToast, showErrorToast } = useToast();

  const form = ref({
    email: '',
    subject: '',
    message: ''
  });

  const loading = ref(false);

  const rules = computed(() => ({
    email: {
      required: helpers.withMessage('Обязательное поле', required),
      email: helpers.withMessage('Пожалуйста, введите корректный email', email)
    },
    subject: {
      required: helpers.withMessage('Обязательное поле', required),
      minLength: helpers.withMessage('Тема должна содержать минимум 3 символа', minLength(3)),
      maxLength: helpers.withMessage('Тема не должна превышать 200 символов', maxLength(200))
    },
    message: {
      required: helpers.withMessage('Обязательное поле', required),
      minLength: helpers.withMessage('Сообщение должно содержать минимум 10 символов', minLength(10)),
      maxLength: helpers.withMessage('Сообщение не должно превышать 5000 символов', maxLength(5000))
    }
  }));

  const v$ = useVuelidate(rules, form);

  const handleSubmit = async () => {
    if (!(await v$.value.$validate())) {
      return;
    }

    loading.value = true;
    try {
      await services.feedback.createFeedback({
        email: form.value.email,
        subject: form.value.subject,
        message: form.value.message
      });
      showSuccessToast('Сообщение успешно отправлено');
      emit('close');
    } catch (err: any) {
      let message = 'Ошибка при отправке сообщения';
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
