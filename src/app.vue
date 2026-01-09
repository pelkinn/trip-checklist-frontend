<template>
  <VApp>
    <LayoutAppHeader v-if="!isPublicPage" />
    <VMain class="main">
      <NuxtPage />
    </VMain>
    <LayoutAppFooter v-if="!isPublicPage" />

    <BaseToastContainer />
    <BaseDialogContainer />
    <BaseCookieBanner />
  </VApp>
  <VitePwaManifest />
</template>

<script setup lang="ts">
  const route = useRoute();
  const isPublicPage = computed(() => route.path.startsWith('/s/'));
</script>

<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
</style>
