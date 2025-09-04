<template>
  <BaseDialogCard>
    <div class="d-flex flex-column justify-center align-center">
      <VIcon
        :icon="mdiCheckCircleOutline"
        color="success"
        size="64"
        class="mb-6"
      />
      <p class="text-h5">Вам отправлено письмо на почту</p>
    </div>
  </BaseDialogCard>
</template>

<script lang="ts" setup>
  import { mdiCheckCircleOutline } from '@mdi/js'
</script>
