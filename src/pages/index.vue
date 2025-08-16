<template>
  <div class="home-page">
    <!-- Header -->
    <header class="app-header">
      <div class="container">
        <div class="d-flex align-center justify-between">
          <div class="d-flex align-center">
            <span class="app-logo mr-2">📍</span>
            <span class="text-h6 font-weight-bold">Trip Checklist</span>
          </div>
          
          <!-- Кнопки для авторизованных пользователей -->
          <template v-if="isAuthenticated">
            <UiBaseButton variant="text" class="mr-2">
              {{ user?.email }}
            </UiBaseButton>
            <UiBaseButton variant="primary" @click="logout">
              Выйти
            </UiBaseButton>
          </template>
          
          <!-- Кнопка входа для неавторизованных пользователей -->
          <template v-else>
            <UiBaseButton variant="primary" @click="goToAuth">
              Войти
            </UiBaseButton>
          </template>
        </div>
      </div>
    </header>
    
    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <div class="text-center">
            <h1 class="text-h3 font-weight-bold mb-4">
              Добро пожаловать в Trip Checklist
            </h1>
            
            <p class="text-h6 text-secondary mb-8">
              Создавайте персональные чеклисты для ваших путешествий
            </p>
            
            <!-- Контент для авторизованных пользователей -->
            <template v-if="isAuthenticated">
              <UiBaseCard class="profile-card" :elevation="2">
                <h2 class="text-h5 mb-4">Ваш профиль</h2>
                <div class="profile-list">
                  <div class="profile-item">
                    <span class="profile-icon">📧</span>
                    <span>{{ user?.email }}</span>
                  </div>
                  <div class="profile-item">
                    <span class="profile-icon">🛡️</span>
                    <span>{{ user?.role }}</span>
                  </div>
                  <div class="profile-item">
                    <span class="profile-icon">✅</span>
                    <span>Email {{ user?.emailVerified ? 'подтвержден' : 'не подтвержден' }}</span>
                  </div>
                </div>
                
                <UiBaseButton variant="primary" size="large" class="mt-4">
                  Создать чеклист
                </UiBaseButton>
              </UiBaseCard>
            </template>
            
                                     <!-- Контент для неавторизованных пользователей -->
            <template v-else>
              <UiBaseCard class="welcome-card" :elevation="2">
                <h2 class="text-h5 mb-4">Начните прямо сейчас</h2>
                <p class="text-body-1 mb-6">
                  Зарегистрируйтесь или войдите в систему, чтобы создавать персональные чеклисты для ваших путешествий.
                </p>
                
                <div class="d-flex gap-4 justify-center">
                  <UiBaseButton variant="primary" size="large" @click="goToAuth">
                    Войти
                  </UiBaseButton>
                  <UiBaseButton variant="outline" size="large" @click="goToAuth">
                    Регистрация
                  </UiBaseButton>
                </div>
              </UiBaseCard>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Используем composable авторизации
const { user, isAuthenticated, logout } = useAuth()

// Переход на страницу авторизации
const goToAuth = () => {
  navigateTo('/auth')
}

// Устанавливаем мета-теги для страницы
useHead({
  title: 'Trip Checklist - Персональные чеклисты путешествий',
  meta: [
    { name: 'description', content: 'Создавайте персональные чеклисты для ваших путешествий' }
  ]
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: var(--background);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-logo {
  font-size: 1.5rem;
}

.main-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.content-wrapper {
  max-width: 600px;
  width: 100%;
}

.profile-card,
.welcome-card {
  max-width: 500px;
  margin: 0 auto;
}

.profile-list {
  margin-bottom: 1.5rem;
}

.profile-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
}

.profile-item:last-child {
  border-bottom: none;
}

.profile-icon {
  font-size: 1.25rem;
  margin-right: 0.75rem;
  width: 24px;
  text-align: center;
}

.gap-4 {
  gap: 1rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem 0;
  }
  
  .content-wrapper {
    padding: 0 1rem;
  }
}
</style>
