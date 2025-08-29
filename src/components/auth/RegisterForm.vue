<template>
  <VCard :elevation="3" class="rounded-lg pa-6">
    <h2 class="text-h5 mb-6">Регистрация</h2>

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

      <v-text-field
        v-model="form.confirmPassword"
        label="Повторите пароль"
        type="password"
        @blur="validateConfirmPasswordField"
        @input="validateConfirmPasswordField"
      />

      <v-btn color="secondary" :loading="isLoading" type="submit" block>
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
  import { reactive } from 'vue'

  const emit = defineEmits<{
    (e: 'login'): void
  }>()

  const authStore = useAuthStore()
  const { isLoading } = storeToRefs(authStore)

  const form = reactive({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const errors = reactive({
    email: '',
    password: '',
    confirmPassword: '',
  })

  const clearValidationErrors = () => {
    errors.email = ''
    errors.password = ''
    errors.confirmPassword = ''
  }

  const validateEmail = (email: string): string => {
    if (!email) return 'Email обязателен'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Введите корректный email'
    return ''
  }

  const validatePassword = (password: string): string => {
    if (!password) return 'Пароль обязателен'
    if (password.length < 8) return 'Пароль должен содержать минимум 8 символов'
    return ''
  }

  const validateConfirmPassword = (confirmPassword: string): string => {
    if (!confirmPassword) return 'Подтверждение пароля обязательно'
    if (confirmPassword !== form.password) return 'Пароли не совпадают'
    return ''
  }

  const validateEmailField = () => {
    errors.email = validateEmail(form.email)
  }

  const validatePasswordField = () => {
    errors.password = validatePassword(form.password)
    if (form.confirmPassword) {
      errors.confirmPassword = validateConfirmPassword(form.confirmPassword)
    }
  }

  const validateConfirmPasswordField = () => {
    errors.confirmPassword = validateConfirmPassword(form.confirmPassword)
  }

  const validateForm = (): boolean => {
    clearValidationErrors()

    errors.email = validateEmail(form.email)
    errors.password = validatePassword(form.password)
    errors.confirmPassword = validateConfirmPassword(form.confirmPassword)

    return !errors.email && !errors.password && !errors.confirmPassword
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    await authStore.register(form.email, form.password)

    if (!authStore.error) {
      form.email = ''
      form.password = ''
      form.confirmPassword = ''
    }
  }
</script>
