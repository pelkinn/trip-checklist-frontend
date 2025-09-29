<template>
  <VCard :elevation="3" class="rounded-lg pa-6">
    <h2 class="text-h5 mb-6">Восстановление пароля</h2>

    <VForm class="mb-6" @submit.prevent="handleSubmit">
      <VTextField v-model="v$.email.$model" label="Email" type="email" :error-messages="getErrorMessage(v$.email)" />

      <VBtn type="submit" color="secondary" :loading="loading" block> Восстановить </VBtn>
    </VForm>

    <p class="text-body-2 text-primary cursor-pointer" @click="emit('backToLogin')">Войти</p>
  </VCard>
</template>

<script setup lang="ts">
  import { useVuelidate } from '@vuelidate/core';
  import { email, helpers, required } from '@vuelidate/validators';

  const emit = defineEmits<{
    (e: 'backToLogin'): void;
  }>();

  const services = useServices();

  const loading = ref(false);

  const form = ref({
    email: ''
  });

  const rules = {
    email: {
      required: helpers.withMessage('Обязательное поле', required),
      email: helpers.withMessage('Некорректный Email', email)
    }
  };

  const v$ = useVuelidate(rules, form);

  const handleSubmit = async () => {
    if (!(await v$.value.$validate())) {
      return;
    }

    loading.value = true;
    try {
      await services.auth.forgotPassword({
        email: form.value.email
      });
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };
</script>
