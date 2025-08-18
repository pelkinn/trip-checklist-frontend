<template>
  <UiBaseCard class="forgot-password-form" :elevation="3">
    <template #header>
      <h2 class="text-h5 text-center">Восстановление пароля</h2>
    </template>
    
    <p class="text-body-2 mb-6 text-center">
      Введите ваш email, и мы отправим инструкции по восстановлению пароля
    </p>
    
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
      
      <!-- Кнопка восстановления -->
      <UiBaseButton
        type="submit"
        variant="primary"
        size="large"
        :loading="isLoading"
        block
        class="mb-4"
      >
        Восстановить
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
      
      <!-- Успешная отправка -->
      <UiBaseAlert
        v-if="isSuccess"
        type="success"
        icon="✅"
        class="mb-4"
      >
        Инструкции по восстановлению пароля отправлены на ваш email.
      </UiBaseAlert>
    </form>
    
    <template #footer>
      <div class="text-center">
        <UiBaseButton
          variant="text"
          size="small"
          @click="$emit('back-to-login')"
        >
          Вернуться к входу
        </UiBaseButton>
      </div>
    </template>
  </UiBaseCard>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// Эмиты
const emit = defineEmits<{
  'back-to-login': []
}>()

// Используем store для авторизации
const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)
const isSuccess = ref(false)

// Форма
const form = reactive({
  email: ''
})

// Ошибки валидации
const errors = reactive({
  email: ''
})

// Очистка ошибки
const clearError = () => {
  error.value = null
}

// Очистка ошибок валидации
const clearValidationErrors = () => {
  errors.email = ''
}

// Валидация email
const validateEmail = (email: string): string => {
  if (!email) return 'Email обязателен'
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return 'Введите корректный email'
  return ''
}

// Валидация email поля
const validateEmailField = () => {
  errors.email = validateEmail(form.email)
}

// Валидация формы
const validateForm = (): boolean => {
  clearValidationErrors()
  
  errors.email = validateEmail(form.email)
  
  return !errors.email
}

// Обработка отправки формы
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  await authStore.forgotPassword(form.email)
  
  // Если нет ошибки, значит письмо отправлено успешно
  if (!authStore.error) {
    isSuccess.value = true
    // Очищаем форму
    form.email = ''
  }
}
</script>

<style scoped>
.forgot-password-form {
  max-width: 400px;
  width: 100%;
}
</style>
