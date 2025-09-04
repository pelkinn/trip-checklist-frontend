<template>
  <VAlert class="base-toast" :type="type" density="comfortable" closable @click:close="emit('close')">{{ text }}</VAlert>
</template>

<script lang="ts" setup>
defineProps<{
  type: 'error' | 'success' | 'warning' | 'info';
  text: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();
</script>

<style lang="scss" scoped>
.base-toast {
  width: 300px;
  margin-bottom: 8px;

  &:last-child {
    margin: 0;
  }
}
</style>
