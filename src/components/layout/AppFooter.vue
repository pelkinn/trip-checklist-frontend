<template>
  <VFooter class="mt-15">
    <VContainer>
      <div class="d-flex flex-column flex-md-row justify-space-between align-center gap-4">
        <div class="text-body-2 text-medium-emphasis">© {{ new Date().getFullYear() }} Trip Checklist. Все права защищены.</div>
        <div>
          <NuxtLink to="/privacy" class="text-body-2 text-primary text-decoration-none"> Политика конфиденциальности </NuxtLink>
        </div>
      </div>
    </VContainer>
  </VFooter>
</template>

<style scoped>
  .v-footer {
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    max-height: 100px;
  }
</style>
