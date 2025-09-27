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
          <p class="mb-15">
            Дата создания:
            <span class="font-weight-bold">{{ formatDateTime(checklist?.createdAt) }}</span>
          </p>
          <div class="d-flex flex-column align-start">
            <div class="d-flex mb-6">
              <VBtn :variant="checklist?.publicToken ? 'outlined' : undefined" class="mr-2" @click="togglePublic">{{
                checklist?.publicToken ? 'Закрыть доступ' : 'Открыть доступ'
              }}</VBtn>
              <VBtn v-if="checklist?.publicToken" :icon="mdiContentCopy" size="small" @click="copyLink" />
            </div>

            <VBtn color="red" variant="tonal" :loading="loading" @click="removeChecklist">Удалить</VBtn>
          </div>
        </div>
        <div class="w-100">
          <p class="text-h5 mb-6">Список вещей</p>

          <div v-for="(item, index) in checklist?.items" :key="item.id">
            <UserChecklistItem
              :id-checklist="idChecklist"
              :item="item"
              @set-checked="(event) => (item.isChecked = event)"
              @remove="() => checklist!.items.splice(index, 1)"
            />
          </div>

          <div class="mt-6">
            <FormAddUserChecklistItem
              v-if="visibilityFormAddItem"
              :id-checklist="idChecklist"
              @cancel="visibilityFormAddItem = false"
              @create="addItem"
            />
            <VBtn v-else density="compact" @click="visibilityFormAddItem = true">Добавить новую вещь</VBtn>
          </div>
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
  import { mdiContentCopy } from '@mdi/js';
  import type { UserChecklistItem } from '~/types/checklist';

  definePageMeta({
    middleware: 'auth'
  });

  const services = useServices();

  const { showSuccessToast } = useToast();

  const route = useRoute();

  const idChecklist = computed(() => Number(route.params.id));

  const { pending, data: checklist } = useLazyAsyncData(() => {
    return services.checklist.getUserChecklist(idChecklist.value);
  });

  const visibilityFormAddItem = ref(false);

  const loading = ref(false);

  const removeChecklist = async () => {
    loading.value = true;
    try {
      await services.checklist.removeUserChecklist(idChecklist.value);
      navigateTo('/checklists');
    } catch (err: any) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  };

  const addItem = (item: UserChecklistItem) => {
    checklist.value!.items.push(item);
    visibilityFormAddItem.value = false;
  };

  const loadingPublic = ref(false);

  const togglePublic = async () => {
    loadingPublic.value = true;
    try {
      const response = await services.checklist.togglePublic(idChecklist.value);
      checklist.value = response;
    } catch (err: any) {
      console.log(err);
    } finally {
      loadingPublic.value = false;
    }
  };

  const copyLink = () => {
    const rootUrl = window.location.origin;
    navigator.clipboard.writeText(`${rootUrl}/s/${checklist.value?.publicToken}`);
    showSuccessToast('Ссылка скопирована в буфер обмена');
  };
</script>

<style scoped>
  .grid {
    display: grid;
    grid-template-columns: minmax(100px, 500px) 500px;
    gap: 16px;
  }
</style>
