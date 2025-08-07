<template>
  <v-app>
    <v-main class="main">
      <VContainer max-width="1200" class="mb-15">
        <NuxtPage />
      </VContainer>
      <div class="text-center pa-2 mt-auto" />
    </v-main>
  </v-app>
  <VitePwaManifest />
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #e0f7fa, #fce4ec);
}
</style>
