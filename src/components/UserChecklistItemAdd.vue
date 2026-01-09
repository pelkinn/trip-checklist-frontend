<template>
  <div>
    <VTextField ref="textFieldRef" v-model="name" label="Название" density="compact" />
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
  }>();

  const emit = defineEmits<{
    (e: 'cancel'): void;
    (e: 'create', value: UserChecklistItem): void;
  }>();

  const services = useServices();

  const name = ref('');

  const loading = ref(false);

  const textFieldRef = ref<any>(null);

  onMounted(() => {
    nextTick(() => {
      if (textFieldRef.value) {
        const input = textFieldRef.value.$el?.querySelector('input');
        if (input) {
          input.focus();
        }
      }
    });
  });

  const addItem = async () => {
    loading.value = true;
    try {
      const item = await services.checklist.addUserChecklistItem(props.idChecklist, name.value);
      emit('create', item);
    } catch (err: any) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };
</script>
