<template>
  <VSnackbar v-model="showBanner" location="bottom" :timeout="-1" color="surface" class="cookie-banner">
    <div class="d-flex align-center gap-4 flex-wrap">
      <span class="text-body-2 mr-4">Предупреждаем об использовании куки</span>
      <VBtn color="primary" size="small" @click="acceptCookies">Ок</VBtn>
    </div>
  </VSnackbar>
</template>

<script setup lang="ts">
  const showBanner = ref(false);

  onMounted(() => {
    const cookieBannerAccepted = localStorage.getItem('cookieBannerAccepted');
    if (!cookieBannerAccepted) {
      showBanner.value = true;
    }
  });

  const acceptCookies = () => {
    localStorage.setItem('cookieBannerAccepted', 'true');
    showBanner.value = false;
  };
</script>

<style scoped>
  .cookie-banner :deep(.v-snackbar__content) {
    padding: 16px;
  }
</style>
