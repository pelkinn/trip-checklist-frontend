<template>
  <div class="d-flex justify-space-between mb-15">
    <VForm v-if="editMode" class="d-flex" @submit.prevent="submit">
      <VTextField v-model="modelTitle" min-width="400" class="mr-5" />
      <div class="d-flex">
        <VBtn class="mr-2" :loading="loading" type="submit">Сохранить</VBtn>
        <VBtn variant="outlined" @click="editMode = false">Отмена</VBtn>
      </div>
    </VForm>

    <p v-else class="text-h3">{{ title }} <VBtn variant="text" :icon="mdiPencil" @click="editMode = true" /></p>
  </div>
</template>

<script lang="ts" setup>
  import { mdiPencil } from '@mdi/js';

  const props = defineProps<{
    idChecklist: number;
    title: string;
  }>();

  const emit = defineEmits<{
    (e: 'change', value: string): void;
  }>();

  const services = useServices();

  const modelTitle = ref(props.title);

  const editMode = ref(false);

  const loading = ref(false);

  const submit = async () => {
    loading.value = true;
    try {
      await services.checklist.changeTitleUserChecklist(props.idChecklist, modelTitle.value);
      emit('change', modelTitle.value);
      editMode.value = false;
    } catch (err: any) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };
</script>
