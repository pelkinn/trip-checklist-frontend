<template>
  <div class="auth-page">
    <!-- Header -->
    <LayoutAppHeader />

    <!-- Main Content -->
    <main class="auth-main">
      <div class="auth-container">
        <!-- Логотип и заголовок -->
        <div class="auth-header">
          <h2 class="auth-subtitle">
            Организуйте поездку с персональными чеклистами
          </h2>
          <div class="auth-logo-container">
            <img
              v-if="currentForm === 'login'"
              src="/assets/images/img1.webp"
              alt=""
              class="img"
            />
            <img
              v-if="currentForm === 'register'"
              src="/assets/images/img2.webp"
              alt=""
              class="img"
            />
            <img
              v-if="currentForm === 'forgot-password'"
              src="/assets/images/img3.webp"
              alt=""
              class="img"
            />
          </div>
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
        <!-- Успешная регистрация -->
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

// Middleware для гостей - перенаправляем авторизованных пользователей
definePageMeta({
  middleware: "auth",
  requireAuth: false, // Разрешаем доступ неавторизованным пользователям
  redirectIfAuth: true, // Перенаправляем авторизованных пользователей
});

// Текущая форма
const currentForm = ref<"login" | "register" | "forgot-password">("login");

// Устанавливаем мета-теги для страницы
useHead({
  title: "Авторизация - Trip Checklist",
  meta: [
    {
      name: "description",
      content:
        "Войдите в систему или зарегистрируйтесь для создания персональных чеклистов путешествий",
    },
  ],
});
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.dark-background {
  background-color: #e0e0e0;
}

.auth-main {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 50px;
  gap: 100px;
}

.auth-container {
  display: grid;
  position: relative;
  grid-template-columns: 65% 35%;
}

.auth-header {
  text-align: center;
  padding-right: 150px;
}

.auth-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

p {
  padding: 0 0;
}
.img {
  max-width: 100%;
  background-color: #4caf50;
}

.icon {
  max-width: 40px;
}

.auth-title {
  font-size: 24px;
  font-weight: 600;
}

.auth-subtitle {
  font-size: 34px;
  color: var(--text-secondary);
}

.auth-logo {
  font-size: 32px;
  margin-right: 8px;
}

.close {
  margin-left: auto;
}

.auth-forms {
  display: flex;
  justify-content: center;
}

.confirm {
  display: flex;
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  border-radius: 20px;
  align-items: center;
  top: 40%;
  max-width: 400px;
  left: 50%;
  padding: 20px;
  gap: 20px;
  transform: translate(-50%, -50%);
  position: absolute;
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
