<template>
  <UiBaseCard class="login-form" :elevation="3">
    <template #header>
      <h2 class="text-h5 text-center">Вход</h2>
    </template>
    
    <form @submit.prevent="handleSubmit">
      <!-- Email поле -->
      <UiBaseInput
        v-model="form.email"
        label="Email"
        placeholder="Email"
        type="email"
        size="large"
        :error="errors.email"
        @blur="validateEmailField"
        @input="validateEmailField"
        class="mb-4"
      />
      
      <!-- Пароль поле -->
      <UiBaseInput
        v-model="form.password"
        label="Пароль"
        placeholder="Пароль"
        type="password"
        size="large"
        :error="errors.password"
        @blur="validatePasswordField"
        @input="validatePasswordField"
        class="mb-4"
      />
      
      <!-- Забыли пароль -->
      <div class="text-right mb-4">
        <UiBaseButton
          variant="text"
          size="small"
          @click="$emit('forgot-password')"
        >
          Забыли пароль?
        </UiBaseButton>
      </div>
      
      <!-- Кнопка входа -->
      <UiBaseButton
        type="submit"
        variant="primary"
        size="large"
        :loading="isLoading"
        block
        class="mb-4"
      >
        Войти
      </UiBaseButton>
      
      <!-- Ошибка -->
      <UiBaseAlert
        v-if="error"
        type="error"
        icon="⚠️"
        closable
        @close="clearError"
        class="mb-4"
      >
        {{ error }}
      </UiBaseAlert>
    </form>
    
    <template #footer>
      <div class="text-center">
        <span class="text-body-2">Нет аккаунта? </span>
        <UiBaseButton
          variant="text"
          size="small"
          @click="$emit('register')"
        >
          Зарегистрироваться
        </UiBaseButton>
      </div>
    </template>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// Эмиты
const emit = defineEmits<{
  register: []
  'forgot-password': []
}>()

// Используем composable авторизации
const { login, isLoading, error, clearError } = useAuth()

// Форма
const form = reactive({
  email: '',
  password: ''
})

// Ошибки валидации
const errors = reactive({
  email: '',
  password: ''
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
  
  const success = await login({
    email: form.email,
    password: form.password
  })
  
  if (success) {
    // Успешный вход - можно добавить редирект или уведомление
    console.log('Успешный вход')
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
  width: 100%;
}
</style>
