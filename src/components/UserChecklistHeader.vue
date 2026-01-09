<template>
  <div class="d-flex justify-space-between w-100">
    <VForm v-if="editMode" class="d-flex flex-column flex-md-row w-100" @submit.prevent="submit">
      <VTextField ref="textFieldRef" v-model="v$.title.$model" class="mr-md-5 w-100 w-md-50" :error-messages="getErrorMessage(v$.title)" />
      <div class="d-flex">
        <VBtn class="mr-2" :loading="loading" type="submit">Сохранить</VBtn>
        <VBtn variant="outlined" @click="editMode = false">Отмена</VBtn>
      </div>
    </VForm>

    <p v-else class="text-h4">{{ title }} <VBtn variant="text" :icon="mdiPencil" @click="editMode = true" /></p>
  </div>
</template>

<script lang="ts" setup>
  import { mdiPencil } from '@mdi/js';
  import { useVuelidate } from '@vuelidate/core';
  import { helpers, maxLength } from '@vuelidate/validators';
  import { getErrorMessage } from '~/utils/validator';

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

  const textFieldRef = ref<any>(null);

  const form = ref({
    title: props.title
  });

  const rules = computed(() => ({
    title: {
      maxLength: helpers.withMessage('Максимум 200 символов', maxLength(200))
    }
  }));

  const v$ = useVuelidate(rules, form);

  watch(
    () => props.title,
    (newTitle) => {
      modelTitle.value = newTitle;
      form.value.title = newTitle;
    }
  );

  watch(editMode, (newValue) => {
    if (newValue) {
      form.value.title = modelTitle.value;
      nextTick(() => {
        if (textFieldRef.value) {
          const input = textFieldRef.value.$el?.querySelector('input');
          if (input) {
            input.focus();
          }
        }
      });
    } else {
      form.value.title = props.title;
      modelTitle.value = props.title;
    }
  });

  watch(
    () => form.value.title,
    (newValue) => {
      modelTitle.value = newValue;
    }
  );

  const submit = async () => {
    if (!(await v$.value.$validate())) {
      return;
    }

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
