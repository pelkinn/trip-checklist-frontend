<template>
  <VCard :elevation="3" class="rounded-lg pa-6">
    <h2 class="text-h5 mb-6">Вход</h2>

    <VForm @submit.prevent="handleSubmit">
      <VTextField v-model="v$.email.$model" label="Email" type="email" :error-messages="getErrorMessage(v$.email)" />

      <VTextField
        v-model="v$.password.$model"
        label="Пароль"
        :type="showPassword ? 'text' : 'password'"
        :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
        :error-messages="getErrorMessage(v$.password)"
        @click:append-inner="showPassword = !showPassword"
      />

      <p class="text-body-2 text-primary cursor-pointer mb-6" @click="emit('forgotPassword')">Забыли пароль?</p>

      <VBtn color="secondary" :loading="loading" type="submit" block> Войти </VBtn>
    </VForm>

    <VDivider class="my-6" />

    <div class="d-flex justify-space-between text-center">
      <span class="text-body-2">Нет аккаунта? </span>
      <span class="text-body-2 text-primary cursor-pointer mb-6" @click="emit('register')"> Зарегистрироваться </span>
    </div>
  </VCard>
</template>

<script setup lang="ts">
  import { mdiEye, mdiEyeOff } from '@mdi/js';
  import useVuelidate from '@vuelidate/core';
  import { email, helpers, minLength, required } from '@vuelidate/validators';

  const emit = defineEmits<{
    (e: 'register'): void;
    (e: 'forgotPassword'): void;
  }>();

  const services = useServices();

  const { showErrorToast } = useToast();

  const runtimeConfig = useRuntimeConfig();

  const { getUser } = useUserStore();

  const accessTokenCookie = useCookie('accessToken');

  const form = ref({
    email: runtimeConfig.public.adminLogin,
    password: runtimeConfig.public.adminPassword
  });

  const showPassword = ref(false);

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

      navigateTo('/checklists');
    } catch (err) {
      showErrorToast('Не верный логин или пароль');
      console.log(err);
    } finally {
      loading.value = false;
    }
  };
</script>
