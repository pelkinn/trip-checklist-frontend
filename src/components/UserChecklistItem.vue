<template>
  <div class="grid-item" :class="{ public: public }">
    <VCheckbox
      :label="item.customName || item.item.name"
      :model-value="item.isChecked"
      hide-details
      :disabled="public"
      @update:model-value="(event) => setChecked(item.id, event)"
    />
    <VBtn
      v-if="!public"
      :icon="mdiDeleteOutline"
      color="red-lighten-1"
      variant="text"
      density="compact"
      :loading="loading"
      @click="removeItem"
    />
  </div>
</template>

<script lang="ts" setup>
  import { mdiDeleteOutline } from '@mdi/js';
  import type { UserChecklistItem } from '~/types/checklist';

  const props = defineProps<{
    idChecklist: number;
    item: UserChecklistItem;
    public?: boolean;
  }>();

  const emit = defineEmits<{
    (e: 'setChecked', value: boolean): void;
    (e: 'remove'): void;
  }>();

  const services = useServices();

  const setChecked = async (id: number, isChecked: boolean | null) => {
    try {
      await services.checklist.updateUserChecklistItem(props.idChecklist, id, {
        isChecked: Boolean(isChecked)
      });
      emit('setChecked', Boolean(isChecked));
    } catch (err: any) {
      console.log(err);
    }
  };

  const loading = ref(false);

  const removeItem = async () => {
    loading.value = true;
    try {
      await services.checklist.removeUserChecklistItem(props.idChecklist, props.item.id);
      emit('remove');
    } catch (err: any) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };
</script>

<style scoped lang="scss">
  .grid-item {
    display: grid;
    grid-template-columns: minmax(min-content, 1fr) 50px;
    gap: 16px;
    flex-grow: 1;
    align-items: center;
  }

  .public {
    :deep(.v-checkbox) {
      .v-selection-control--disabled {
        opacity: 1;
      }

      .v-selection-control__wrapper {
        opacity: var(--v-disabled-opacity);
      }
    }
  }
</style>
