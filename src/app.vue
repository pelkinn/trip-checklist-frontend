<template>
  <VApp>
    <VMain class="main">
      <NuxtPage />
      <div class="text-center pa-2 mt-auto" />
    </VMain>
  </VApp>
  <VitePwaManifest />
</template>

<style scoped>
  .main {
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }
</style>
