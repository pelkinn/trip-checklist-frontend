<template>
  <VDialog
    v-for="[key, dialog] in dialogs"
    :key="key"
    v-bind="{
      ...(xs || dialog.dialogProps?.fullscreen
        ? { fullscreen: true }
        : { width: 600 }),
      ...dialog.dialogProps,
    }"
    :model-value="dialogsOpened.get(key)"
    v-on="dialog.dialogListeners ?? {}"
    @update:model-value="closeDialog(key)"
  >
    <Component
      :is="dialog.component"
      v-bind="dialog.props"
      class="dialog-card rounded-xl"
      v-on="dialog.listeners ?? {}"
      @close="closeDialog(key)"
    />
    <VBtn
      v-if="!dialog.dialogProps?.persistent"
      density="compact"
      color="white"
      :icon="mdiClose"
      class="close-btn"
      variant="flat"
      @click="closeDialog(key)"
    />
  </VDialog>
</template>

<script lang="ts" setup>
  import { mdiClose } from '@mdi/js'
  import { useDisplay } from 'vuetify'

  const { xs } = useDisplay()

  const { dialogs, dialogsOpened, closeDialog } = useDialog()
</script>

<style lang="scss" scoped>
  .dialog-card {
    overflow-y: auto;
    background-color: map.get(v.$shades, 'white');
  }

  .close-btn {
    position: absolute;
    top: 24px;
    right: 24px;
  }
</style>
