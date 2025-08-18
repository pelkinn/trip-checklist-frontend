<template>
  <div class="auth-page">
    <!-- Header -->
    <LayoutAppHeader />
    
    <!-- Main Content -->
    <main class="auth-main">
      <div class="auth-container">
                 <!-- Логотип и заголовок -->
         <div class="auth-header">
           <div class="auth-logo-container">
             <span class="auth-logo">📍</span>
             <h1 class="auth-title">Trip Checklist</h1>
           </div>
           <h2 class="auth-subtitle">
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// Middleware для гостей - перенаправляем авторизованных пользователей
definePageMeta({
  middleware: 'auth',
  requireAuth: false, // Разрешаем доступ неавторизованным пользователям
  redirectIfAuth: true // Перенаправляем авторизованных пользователей
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
  background-color: #fff;
  display: flex;
  flex-direction: column;
}



.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
}

.auth-container {
  max-width: 500px;
  width: 100%;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.auth-title {
  font-size: 24px;
  font-weight: 600;
}

.auth-subtitle {
  font-size: 18px;
  color: var(--text-secondary);
}

.auth-logo {
  font-size: 32px;
  margin-right: 8px;
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
  .auth-main {
    padding: 16px;
  }
  
  .auth-container {
    max-width: 100%;
  }
}
</style>
