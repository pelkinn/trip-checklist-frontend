<template>
  <VCard class="base-dialog-card" density="comfortable">
    <div v-if="icon" :class="['header', `bg-${color}-lighten-4`]">
      <VIcon size="32" :color="color" :icon="icon" />
    </div>
    <div class="content">
      <div v-if="slots.title" class="title text-h5">
        <slot name="title" />
      </div>
      <div v-if="slots.description" class="description">
        <slot name="description" />
      </div>
      <div v-if="slots.default" class="other">
        <slot />
      </div>
    </div>
    <VDivider />
    <div v-if="slots.buttons" class="buttons">
      <slot name="buttons" />
    </div>
  </VCard>
</template>

<script lang="ts" setup>
  defineProps<{
    icon?: string;
    color?: string;
    onClose?: () => void;
  }>();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const slots = useSlots();
</script>

<style lang="scss" scoped>
  .base-dialog-card {
    display: flex;
    flex-direction: column;

    .v-btn {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .header {
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 96px;
    width: 100%;
  }

  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 24px;

    & > *:not(:last-child) {
      margin-bottom: 24px;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px;

    @media #{map.get(v.$display-breakpoints, 'xs')} {
      padding: 4px 24px;
    }

    :deep() {
      > .v-btn {
        margin: 4px;
      }
    }
  }

  .other {
    height: 100%;
  }

  .title {
    padding-right: 48px;
  }
</style>
