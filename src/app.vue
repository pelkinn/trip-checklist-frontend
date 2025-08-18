<template>
  <div>
    <main class="main">
      <div max-width="1200" class="mb-15">
        <NuxtPage />
      </div>
      <div class="text-center pa-2 mt-auto" />
    </main>
  </div>
  <VitePwaManifest />
</template>

<style scoped>
.main {
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
</style>
