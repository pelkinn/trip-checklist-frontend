<template>
  <VFooter class="mt-15">
    <VContainer>
      <div class="d-flex flex-column flex-md-row justify-space-between align-center gap-4">
        <div class="text-body-2 text-medium-emphasis">© {{ new Date().getFullYear() }} Trip Checklist. Все права защищены.</div>
        <div class="d-flex flex-column flex-md-row align-center gap-4">
          <VBtn variant="text" size="small" class="mr-4" @click="openFeedbackDialog">Обратная связь</VBtn>
          <NuxtLink to="/privacy" class="text-body-2 text-primary text-decoration-none"> Политика конфиденциальности </NuxtLink>
        </div>
      </div>
    </VContainer>
  </VFooter>
</template>

<script setup lang="ts">
  import { LazyBaseFeedbackForm } from '#components';

  const { openDialog } = useDialog();

  const openFeedbackDialog = () => {
    openDialog({
      component: LazyBaseFeedbackForm
    });
  };
</script>

<style scoped>
  .v-footer {
    border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
    max-height: 100px;
  }
</style>
