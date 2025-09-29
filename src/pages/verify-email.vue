<template>
  <div class="d-flex flex-column justify-center align-center">
    <VProgressCircular v-if="pending" indeterminate />

    <div v-else-if="!error" class="d-flex flex-column justify-center align-center">
      <VIcon :icon="mdiCheckCircleOutline" color="success" size="64" class="mb-6" />
      <p class="text-h5">Вы успешно зарегистрировались</p>

      <VBtn class="mt-16" to="/auth">Войти</VBtn>
    </div>

    <div v-else class="d-flex flex-column justify-center align-center">
      <VIcon :icon="mdiCloseCircleOutline" color="error" size="64" class="mb-6" />
      <p class="text-h5">Email не подтвержден</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { mdiCheckCircleOutline, mdiCloseCircleOutline } from '@mdi/js';

  const services = useServices();

  const route = useRoute();

  const { pending, error } = useLazyAsyncData(() => {
    return services.auth.verifyEmail(route.query.token as string);
  });
</script>
