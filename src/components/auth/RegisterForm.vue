<template>
  <VCard :elevation="3" class="rounded-lg pa-6">
    <h2 class="text-h5 mb-6">Регистрация</h2>

    <VForm @submit.prevent="handleSubmit">
      <v-text-field
        v-model="v$.email.$model"
        label="Email"
        type="email"
        :error-messages="getErrorMessage(v$.email)"
      />

      <v-text-field
        v-model="v$.password.$model"
        label="Пароль"
        type="password"
        :error-messages="getErrorMessage(v$.password)"
      />

      <v-text-field
        v-model="v$.confirmPassword.$model"
        label="Повторите пароль"
        type="password"
        :error-messages="getErrorMessage(v$.confirmPassword)"
      />

      <v-btn color="secondary" :loading="loading" type="submit" block>
        Зарегистрироваться
      </v-btn>
    </VForm>

    <VDivider class="my-6" />

    <div class="d-flex">
      <span
        class="text-body-2 text-primary cursor-pointer"
        @click="emit('login')"
      >
        Войти
      </span>
    </div>
  </VCard>
</template>

<script setup lang="ts">
  import { LazyAuthRegisterDialogSuccess } from '#components'
  import { useVuelidate } from '@vuelidate/core'
  import {
    email,
    helpers,
    minLength,
    required,
    sameAs,
  } from '@vuelidate/validators'

  const emit = defineEmits<{
    (e: 'login'): void
  }>()

  const services = useServices()

  const { openDialog } = useDialog()

  const form = ref({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const loading = ref(false)

  const rules = computed(() => ({
    email: {
      required: helpers.withMessage('Обязательное поле', required),
      email: helpers.withMessage('Некорректный Email', email),
    },
    password: {
      required: helpers.withMessage('Обязательное поле', required),
      minLength: helpers.withMessage('Обязательное поле', minLength(6)),
    },
    confirmPassword: {
      required: helpers.withMessage('Обязательное поле', required),
      sameAs: helpers.withMessage(
        'Пароли не совпадают',
        sameAs(form.value.password)
      ),
    },
  }))

  const v$ = useVuelidate(rules, form)

  const handleSubmit = async () => {
    if (!(await v$.value.$validate())) {
      return
    }

    loading.value = true
    try {
      await services.auth.register({
        email: form.value.email,
        password: form.value.password,
      })
      openDialogSuccess()
    } catch (err) {
      console.log(err)
    } finally {
      loading.value = false
    }
  }

  const openDialogSuccess = () => {
    openDialog({
      component: LazyAuthRegisterDialogSuccess,
    })
  }
</script>
