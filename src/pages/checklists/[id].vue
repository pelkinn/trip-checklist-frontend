<template>
  <VContainer>
    <div v-if="pending" class="text-center py-8">
      <VProgressCircular indeterminate />
    </div>

    <div v-else>
      <div class="d-flex justify-space-between mb-15">
        <p class="text-h3">{{ checklist?.nameTripType }}</p>
      </div>
      <div class="grid">
        <div>
          <p class="mb-4">
            Продолжительность:
            <span class="font-weight-bold">{{ checklist?.duration.label }}</span>
          </p>
          <p class="mb-15">
            Дата создания:
            <span class="font-weight-bold">{{ formatDateTime(checklist?.createdAt) }}</span>
          </p>
          <VBtn color="red" variant="tonal" :loading="loadingRemove" @click="removeChecklist">Удалить</VBtn>
        </div>
        <div>
          <p class="text-h5 mb-6">Список элементов</p>
          <div class="d-flex">
            <div class="d-flex justify-center flex-column">
              <VCheckbox
                v-for="item in checklist?.items"
                :key="item.id"
                :label="item.customName || item.item.name"
                :model-value="item.isChecked"
                hide-details
                @update:model-value="setChecked(item.id, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: 'auth'
  });

  const services = useServices();

  const route = useRoute();

  const { pending, data: checklist } = useLazyAsyncData(() => {
    return services.checklist.getUserChecklist(Number(route.params.id));
  });

  const loadingRemove = ref(false);

  const removeChecklist = async () => {
    loadingRemove.value = true;
    try {
      await services.checklist.removeUserChecklist(Number(route.params.id));
      navigateTo('/checklists');
    } catch (err: any) {
      console.log(err);
    } finally {
      loadingRemove.value = false;
    }
  };

  const setChecked = async (id: number, isChecked: boolean | null) => {
    try {
      await services.checklist.updateUserChecklistItem(Number(route.params.id), id, {
        isChecked: Boolean(isChecked)
      });
      const item = checklist.value!.items.find((el) => el.id === id);
      if (item) item.isChecked = Boolean(isChecked);
    } catch (err: any) {
      console.log(err);
    }
  };
</script>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
  }
</style>
