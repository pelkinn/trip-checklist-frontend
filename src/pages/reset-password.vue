<template>
  <VContainer>
    <h2 class="text-h5 mb-6">Введите новый пароль</h2>
    <VForm class="w-100 w-sm-50 w-lg-25" @submit.prevent="handleSubmit">
      <v-text-field v-model="v$.password.$model" label="Пароль" type="password" :error-messages="getErrorMessage(v$.password)" />
      <v-text-field
        v-model="v$.confirmPassword.$model"
        label="Повторите пароль"
        type="password"
        :error-messages="getErrorMessage(v$.confirmPassword)"
      />

      <v-btn :loading="loading" type="submit"> Отправить </v-btn>
    </VForm>
  </VContainer>
</template>

<script setup lang="ts">
  import { LazyAuthResetPasswordDialogSuccess } from '#components';
  import { useVuelidate } from '@vuelidate/core';
  import { helpers, minLength, required, sameAs } from '@vuelidate/validators';

  const services = useServices();

  const route = useRoute();

  const { openDialog } = useDialog();

  const { showErrorToast } = useToast();

  const form = ref({
    email: '',
    password: '',
    confirmPassword: ''
  });

  const loading = ref(false);

  const rules = computed(() => ({
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
      await services.auth.resetPassword({
        token: String(route.query.token),
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
      component: LazyAuthResetPasswordDialogSuccess
    });
  };
</script>
