<template>
  <VApp>
    <LayoutAppHeader />
    <VMain class="main">
      <NuxtPage />
    </VMain>

    <BaseToastContainer />
    <BaseDialogContainer />
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
