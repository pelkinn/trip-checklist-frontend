<template>
  <VAppBar class="app-header" flat>
    <VContainer class="container">
      <div class="d-flex align-center justify-space-between">
        <div class="header-left">
          <NuxtLink to="/" class="header-logo">
            <img src="/assets/logo.webp" alt="" class="logo" />
          </NuxtLink>
        </div>

        <div class="d-flex align-center">
          <template v-if="user">
            <LayoutHeaderUser />
          </template>

          <VBtn v-else to="/auth" :active="false"> Войти </VBtn>
        </div>
      </div>
    </VContainer>
  </VAppBar>
</template>

<script setup lang="ts">
  const authStore = useUserStore();
  const { user } = storeToRefs(authStore);
</script>

<style scoped>
  .logo {
    height: 50px;
  }

  .header-logo {
    display: flex;
    align-items: center;
    text-decoration: none;
    color: inherit;
  }
</style>
