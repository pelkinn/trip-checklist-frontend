<template>
  <VCard :elevation="3" class="rounded-lg pa-6">
    <h2 class="text-h5 mb-6">Вход</h2>

    <VForm @submit.prevent="handleSubmit">
      <v-text-field v-model="v$.email.$model" label="Email" type="email" :error-messages="getErrorMessage(v$.email)" />

      <v-text-field v-model="v$.password.$model" label="Пароль" type="password" :error-messages="getErrorMessage(v$.password)" />

      <p class="text-body-2 text-primary cursor-pointer mb-6" @click="emit('forgotPassword')">Забыли пароль?</p>

      <v-btn color="secondary" :loading="loading" type="submit" block> Войти </v-btn>
    </VForm>

    <VDivider class="my-6" />

    <div class="d-flex justify-space-between text-center">
      <span class="text-body-2">Нет аккаунта? </span>
      <span class="text-body-2 text-primary cursor-pointer mb-6" @click="emit('register')"> Зарегистрироваться </span>
    </div>
  </VCard>
</template>

<script setup lang="ts">
  import useVuelidate from '@vuelidate/core';
  import { email, helpers, minLength, required } from '@vuelidate/validators';

  const emit = defineEmits<{
    (e: 'register' | 'forgotPassword'): void;
  }>();

  const services = useServices();

  const runtimeConfig = useRuntimeConfig();

  const { getUser } = useUserStore();

  const accessTokenCookie = useCookie('accessToken');

  const form = ref({
    email: runtimeConfig.public.adminLogin,
    password: runtimeConfig.public.adminPassword
  });

  const loading = ref(false);

  const rules = {
    email: {
      required: helpers.withMessage('Обязательное поле', required),
      email: helpers.withMessage('Некорректный Email', email)
    },
    password: {
      required: helpers.withMessage('Обязательное поле', required),
      minLength: helpers.withMessage('Обязательное поле', minLength(6))
    }
  };

  const v$ = useVuelidate(rules, form);

  const handleSubmit = async () => {
    if (!(await v$.value.$validate())) {
      return;
    }

    loading.value = true;
    try {
      const { accessToken } = await services.auth.login({
        email: form.value.email,
        password: form.value.password
      });

      accessTokenCookie.value = accessToken;

      await nextTick();

      await getUser();

      navigateTo('/checklist');
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };
</script>
