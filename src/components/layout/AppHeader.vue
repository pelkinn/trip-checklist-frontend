<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <div class="header-left">
          <NuxtLink to="/" class="header-logo">
            <img src="/assets/logo.webp" alt="" class="logo" />
          </NuxtLink>
        </div>

        <div class="header-right">
          <!-- Для авторизованных пользователей -->
          <template v-if="isAuthenticated">
            <UiBaseButton variant="text" class="user-email">
              {{ user?.email }}
            </UiBaseButton>
            <UiBaseButton variant="outline" @click="goToChecklists">
              Личный кабинет
            </UiBaseButton>
            <UiBaseButton variant="primary" @click="logout">
              Выйти
            </UiBaseButton>
          </template>

          <!-- Для неавторизованных пользователей -->
          <template v-else>
            <UiBaseButton variant="primary" @click="goToAuth">
              Войти
            </UiBaseButton>
          </template>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  // Используем store для авторизации
  const authStore = useAuthStore()
  const { user, isAuthenticated } = storeToRefs(authStore)

  // Переход на страницу авторизации
  const goToAuth = () => {
    navigateTo('/auth')
  }

  // Переход в личный кабинет
  const goToChecklists = () => {
    navigateTo('/checklists')
  }

  // Выход из системы
  const logout = () => {
    authStore.logout()
    navigateTo('/')
  }
</script>

<style scoped>
  .app-header {
    background-color: var(--background);
    border-bottom: 1px solid var(--border-color);
    padding: 16px 0;
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .logo {
    height: 50px;
  }

  .header-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }

  .app-logo {
    font-size: 24px;
    margin-right: 8px;
  }

  .app-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-email {
    margin-right: 8px;
  }
</style>
