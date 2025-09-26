<template>
  <VCard :elevation="3" class="rounded-lg pa-6">
    <h2 class="text-h5 mb-6">Регистрация</h2>

    <VForm @submit.prevent="handleSubmit">
      <VTextField v-model="v$.email.$model" label="Email" type="email" :error-messages="getErrorMessage(v$.email)" />

      <VTextField v-model="v$.password.$model" label="Пароль" type="password" :error-messages="getErrorMessage(v$.password)" />

      <VTextField
        v-model="v$.confirmPassword.$model"
        label="Повторите пароль"
        type="password"
        :error-messages="getErrorMessage(v$.confirmPassword)"
      />

      <VBtn color="secondary" :loading="loading" type="submit" block> Зарегистрироваться </VBtn>
    </VForm>

    <VDivider class="my-6" />

    <div class="d-flex">
      <span class="text-body-2 text-primary cursor-pointer" @click="emit('login')"> Войти </span>
    </div>
  </VCard>
</template>

<script setup lang="ts">
  import { LazyAuthRegisterDialogSuccess } from '#components';
  import { useVuelidate } from '@vuelidate/core';
  import { email, helpers, minLength, required, sameAs } from '@vuelidate/validators';

  const emit = defineEmits<{
    (e: 'login'): void;
  }>();

  const services = useServices();

  const { openDialog } = useDialog();

  const { showErrorToast } = useToast();

  const form = ref({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const loading = ref(false);

  const rules = computed(() => ({
    email: {
      required: helpers.withMessage('Обязательное поле', required),
      email: helpers.withMessage('Некорректный Email', email)
    },
    password: {
      required: helpers.withMessage('Обязательное поле', required),
      minLength: helpers.withMessage('Обязательное поле', minLength(8)),
      containsDigit: helpers.withMessage('Минимум одна цифра', containsDigit)
    },
    confirmPassword: {
      required: helpers.withMessage('Обязательное поле', required),
      sameAs: helpers.withMessage('Пароли не совпадают', sameAs(form.value.password)),
      containsDigit: helpers.withMessage('Минимум одна цифра', containsDigit)
    }
  }));

  const v$ = useVuelidate(rules, form);

  const handleSubmit = async () => {
    if (!(await v$.value.$validate())) {
      return;
    }

    loading.value = true;
    try {
      await services.auth.register({
        email: form.value.email,
        password: form.value.password
      });
      openDialogSuccess();
    } catch (err: any) {
      let message = 'Ошибка';
      if (err.response?._data?.message) {
        message = Array.isArray(err.response._data.message) ? err.response._data.message[0] : err.response._data.message;
      }
      showErrorToast(message);
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const openDialogSuccess = () => {
    openDialog({
      component: LazyAuthRegisterDialogSuccess
    });
  };
</script>
