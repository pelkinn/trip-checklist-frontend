<template>
  <BaseDialogCard>
    <template #title>Удалить чеклист?</template>
    <template #description> Вы уверены, что хотите удалить этот чеклист? Это действие нельзя отменить. </template>
    <template #buttons>
      <VBtn variant="text" @click="emit('close')">Отменить</VBtn>
      <VBtn color="red" :loading="loading" @click="handleConfirm">Удалить</VBtn>
    </template>
  </BaseDialogCard>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    (e: 'close'): void;
    (e: 'confirm'): void;
  }>();

  const loading = ref(false);

  const handleConfirm = async () => {
    loading.value = true;
    try {
      emit('confirm');
      emit('close');
    } finally {
      loading.value = false;
    }
  };
</script>
