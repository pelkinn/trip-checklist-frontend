<template>
  <UiBaseCard :elevation="3" class="mb-auto rounded-lg">
    <template #header>
      <h2 class="text-h5">Вход22</h2>
    </template>

    <form class="custom-grid-form" @submit.prevent="handleSubmit">
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        size="large"
        @blur="validateEmailField"
        @input="validateEmailField"
      />

      <div class="password-container">
        <v-text-field
          v-model="form.password"
          label="Пароль"
          type="password"
          size="large"
          class="mb-2"
          @blur="validatePasswordField"
          @input="validatePasswordField"
        />

        <div class="d-flex">
          <v-btn
            variant="text"
            size="small"
            class="forgot-password-btn"
            @click="$emit('forgot-password')"
          >
            Забыли пароль?
          </v-btn>
        </div>
      </div>

      <v-btn
        color="secondary"
        variant="flat"
        height="45"
        :loading="isLoading"
        type="submit"
        block
      >
        Войти
      </v-btn>

      <!-- Ошибка -->
      <!-- <UiBaseAlert
        v-if="error"
        type="error"
        icon="⚠️"
        closable
        class="mb-4"
        @close="clearError"
      >
        {{ error }}
      </UiBaseAlert> -->

      <div class="border-sm" />
    </form>

    <template #footer>
      <div class="text-center">
        <span class="text-body-2">Нет аккаунта? </span>
        <VBtn variant="text" size="small" @click="$emit('register')">
          Зарегистрироваться
        </VBtn>
      </div>
    </template>
  </UiBaseCard>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    register: []
    'forgot-password': []
  }>()

  const authStore = useAuthStore()
  const { isLoading, error } = storeToRefs(authStore)

  const form = reactive({
    email: '',
    password: '',
  })

  // Ошибки валидации
  const errors = reactive({
    email: '',
    password: '',
  })

  // Очистка ошибок валидации
  const clearValidationErrors = () => {
    errors.email = ''
    errors.password = ''
  }

  // Валидация email
  const validateEmail = (email: string): string => {
    if (!email) return 'Email обязателен'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Введите корректный email'
    return ''
  }

  // Валидация пароля
  const validatePassword = (password: string): string => {
    if (!password) return 'Пароль обязателен'
    if (password.length < 6) return 'Пароль должен содержать минимум 6 символов'
    return ''
  }

  // Валидация email поля
  const validateEmailField = () => {
    errors.email = validateEmail(form.email)
  }

  // Валидация пароля поля
  const validatePasswordField = () => {
    errors.password = validatePassword(form.password)
  }

  // Валидация формы
  const validateForm = (): boolean => {
    clearValidationErrors()

    errors.email = validateEmail(form.email)
    errors.password = validatePassword(form.password)

    return !errors.email && !errors.password
  }

  // Обработка отправки формы
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    await authStore.login(form.email, form.password)

    // Если нет ошибки, значит вход успешен
    if (!authStore.error) {
      // Успешный вход - редирект на страницу чеклистов
      navigateTo('/checklists')
    }
  }

  // Очистка ошибки
  const clearError = () => {
    authStore.clearError()
  }
</script>

<style scoped>
  .custom-grid-form {
    display: grid;
    gap: 20px;
  }

  .password-container {
    position: relative;
  }
  .forgot-password-btn {
    margin-top: -18px;
    padding: 0;
  }
</style>
