<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Логотип и заголовок -->
      <div class="auth-header text-center mb-8">
        <div class="d-flex align-center justify-center mb-4">
          <span class="auth-logo mr-2">📍</span>
          <h1 class="text-h4 font-weight-bold">Trip Checklist</h1>
        </div>
        <h2 class="text-h5 text-secondary">
          Организуйте поездку с персональными чеклистами
        </h2>
      </div>
      
      <!-- Формы авторизации -->
      <div class="auth-forms">
        <!-- Форма входа -->
        <AuthLoginForm
          v-if="currentForm === 'login'"
          @register="currentForm = 'register'"
          @forgot-password="currentForm = 'forgot-password'"
        />
        
        <!-- Форма регистрации -->
        <AuthRegisterForm
          v-else-if="currentForm === 'register'"
          @login="currentForm = 'login'"
        />
        
        <!-- Форма восстановления пароля -->
        <AuthForgotPasswordForm
          v-else-if="currentForm === 'forgot-password'"
          @back-to-login="currentForm = 'login'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Middleware для гостей
definePageMeta({
  middleware: 'guest'
})

// Текущая форма
const currentForm = ref<'login' | 'register' | 'forgot-password'>('login')

// Устанавливаем мета-теги для страницы
useHead({
  title: 'Авторизация - Trip Checklist',
  meta: [
    { name: 'description', content: 'Войдите в систему или зарегистрируйтесь для создания персональных чеклистов путешествий' }
  ]
})
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.auth-container {
  max-width: 500px;
  width: 100%;
}

.auth-logo {
  font-size: 2rem;
}

.auth-forms {
  display: flex;
  justify-content: center;
}

/* Анимация появления форм */
.auth-forms > * {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .auth-page {
    padding: 1rem;
  }
  
  .auth-container {
    max-width: 100%;
  }
}
</style>
