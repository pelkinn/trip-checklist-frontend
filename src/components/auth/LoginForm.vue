<template>
  <VCard :elevation="3" class="rounded-lg pa-6">
    <h2 class="text-h5 mb-6">Вход</h2>

    <VForm @submit.prevent="handleSubmit">
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        @blur="validateEmailField"
        @input="validateEmailField"
      />

      <v-text-field
        v-model="form.password"
        label="Пароль"
        type="password"
        @blur="validatePasswordField"
        @input="validatePasswordField"
      />

      <p
        class="text-body-2 text-primary cursor-pointer mb-6"
        @click="emit('forgot-password')"
      >
        Забыли пароль?
      </p>

      <v-btn color="secondary" :loading="isLoading" type="submit" block>
        Войти
      </v-btn>
    </VForm>

    <VDivider class="my-6" />

    <div class="d-flex justify-space-between text-center">
      <span class="text-body-2">Нет аккаунта? </span>
      <span
        class="text-body-2 text-primary cursor-pointer mb-6"
        @click="emit('register')"
      >
        Зарегистрироваться
      </span>
    </div>
  </VCard>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    (e: 'register' | 'forgot-password'): void
  }>()

  const authStore = useAuthStore()
  const { isLoading } = storeToRefs(authStore)

  const form = reactive({
    email: '',
    password: '',
  })

  const errors = reactive({
    email: '',
    password: '',
  })

  const clearValidationErrors = () => {
    errors.email = ''
    errors.password = ''
  }

  const validateEmail = (email: string): string => {
    if (!email) return 'Email обязателен'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Введите корректный email'
    return ''
  }

  const validatePassword = (password: string): string => {
    if (!password) return 'Пароль обязателен'
    if (password.length < 6) return 'Пароль должен содержать минимум 6 символов'
    return ''
  }

  const validateEmailField = () => {
    errors.email = validateEmail(form.email)
  }

  const validatePasswordField = () => {
    errors.password = validatePassword(form.password)
  }

  const validateForm = (): boolean => {
    clearValidationErrors()

    errors.email = validateEmail(form.email)
    errors.password = validatePassword(form.password)

    return !errors.email && !errors.password
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    await authStore.login(form.email, form.password)

    if (!authStore.error) {
      navigateTo('/checklists')
    }
  }
</script>
