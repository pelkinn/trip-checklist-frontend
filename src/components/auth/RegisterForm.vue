<template>
  <UiBaseCard class="register-form" :elevation="3">
    <template #header>
      <h2 class="text-h5 text-center">Регистрация</h2>
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
      
      <!-- Повторите пароль поле -->
      <UiBaseInput
        v-model="form.confirmPassword"
        label="Повторите пароль"
        placeholder="Повторите пароль"
        type="password"
        size="large"
        :error="errors.confirmPassword"
        @blur="validateConfirmPasswordField"
        @input="validateConfirmPasswordField"
        class="mb-4"
      />
      
      <!-- Кнопка регистрации -->
      <UiBaseButton
        type="submit"
        variant="primary"
        size="large"
        :loading="isLoading"
        block
        class="mb-4"
      >
        Зарегистрироваться
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
      
      <!-- Успешная регистрация -->
      <UiBaseAlert
        v-if="isSuccess"
        type="success"
        icon="✅"
        class="mb-4"
      >
        Регистрация прошла успешно! Проверьте вашу почту для подтверждения email.
      </UiBaseAlert>
    </form>
    
    <template #footer>
      <div class="text-center">
        <span class="text-body-2">Уже есть аккаунт? </span>
        <UiBaseButton
          variant="text"
          size="small"
          @click="$emit('login')"
        >
          Войти
        </UiBaseButton>
      </div>
    </template>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// Эмиты
const emit = defineEmits<{
  login: []
}>()

// Используем store для авторизации
const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)
const isSuccess = ref(false)

// Форма
const form = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

// Ошибки валидации
const errors = reactive({
  email: '',
  password: '',
  confirmPassword: ''
})

// Очистка ошибки
const clearError = () => {
  error.value = null
}

// Очистка ошибок валидации
const clearValidationErrors = () => {
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''
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
  if (password.length < 8) return 'Пароль должен содержать минимум 8 символов'
  return ''
}

// Валидация подтверждения пароля
const validateConfirmPassword = (confirmPassword: string): string => {
  if (!confirmPassword) return 'Подтверждение пароля обязательно'
  if (confirmPassword !== form.password) return 'Пароли не совпадают'
  return ''
}

// Валидация email поля
const validateEmailField = () => {
  errors.email = validateEmail(form.email)
}

// Валидация пароля поля
const validatePasswordField = () => {
  errors.password = validatePassword(form.password)
  // Также валидируем подтверждение пароля, так как оно зависит от пароля
  if (form.confirmPassword) {
    errors.confirmPassword = validateConfirmPassword(form.confirmPassword)
  }
}

// Валидация подтверждения пароля поля
const validateConfirmPasswordField = () => {
  errors.confirmPassword = validateConfirmPassword(form.confirmPassword)
}

// Валидация формы
const validateForm = (): boolean => {
  clearValidationErrors()
  
  errors.email = validateEmail(form.email)
  errors.password = validatePassword(form.password)
  errors.confirmPassword = validateConfirmPassword(form.confirmPassword)
  
  return !errors.email && !errors.password && !errors.confirmPassword
}

// Обработка отправки формы
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  await authStore.register(form.email, form.password)
  
  // Если нет ошибки, значит регистрация успешна
  if (!authStore.error) {
    isSuccess.value = true
    // Очищаем форму
    form.email = ''
    form.password = ''
    form.confirmPassword = ''
  }
}
</script>

<style scoped>
.register-form {
  max-width: 400px;
  width: 100%;
}
</style>
