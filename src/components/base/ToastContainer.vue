<template>
  <TransitionGroup class="base-toast-container" tag="div" name="fade">
    <BaseToast v-for="[key, toast] in toasts" :key="key" v-bind="toast" @close="hideToast(key)" />
  </TransitionGroup>
</template>

<script setup lang="ts">
const { toasts, hideToast } = useToast();
</script>

<style lang="scss">
.base-toast-container {
  z-index: 10000;
  position: fixed;
  top: 24px;
  right: 24px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .base-alert {
    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
}
</style>
