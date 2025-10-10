<template>
  <div>
    <VTextField v-model="name" density="compact" />
    <div class="d-flex">
      <VBtn class="mr-2" density="compact" :loading="loading" @click="addItem">Сохранить</VBtn>
      <VBtn density="compact" variant="outlined" @click="emit('cancel')">Отменить</VBtn>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { UserChecklistItem } from '~/types/checklist';

  const props = defineProps<{
    idChecklist: number;
    order: number;
  }>();

  const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'create', value: UserChecklistItem): void;
  }>();

  const services = useServices();

  const name = ref('');

  const loading = ref(false);

  const addItem = async () => {
    loading.value = true;
    try {
      const item = await services.checklist.addUserChecklistItem(props.idChecklist, name.value, props.order);
      emit('create', item);
    } catch (err: any) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };
</script>
