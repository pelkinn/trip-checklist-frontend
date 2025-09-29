<template>
  <header class="app-header">
    <VContainer class="container">
      <div class="header-content">
        <div class="header-left">
          <NuxtLink to="/" class="header-logo">
            <img src="/assets/logo.webp" alt="" class="logo" />
          </NuxtLink>
        </div>

        <div class="header-right">
          <template v-if="user">
            <VBtn variant="text" class="user-email">
              {{ user?.email }}
            </VBtn>
            <VBtn variant="outlined" to="/checklists"> Личный кабинет </VBtn>
            <VBtn @click="logoutFn"> Выйти </VBtn>
          </template>

          <!-- Для неавторизованных пользователей -->
          <template v-else>
            <VBtn to="/auth"> Войти </VBtn>
          </template>
        </div>
      </div>
    </VContainer>
  </header>
</template>

<script setup lang="ts">
  const authStore = useUserStore();
  const { user } = storeToRefs(authStore);
  const { logout } = authStore;

  const logoutFn = () => {
    logout();
    navigateTo('/');
  };
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
