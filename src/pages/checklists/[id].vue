<template>
  <VContainer>
    <div v-if="pending" class="text-center py-8">
      <VProgressCircular indeterminate />
    </div>

    <div v-else>
      <UserChecklistHeader
        :id-checklist="idChecklist"
        :title="checklist?.name || checklist!.nameTripType"
        class="mb-15"
        @change="(event: string) => (checklist!.name = event)"
      />
      <div class="grid">
        <div>
          <div class="d-flex flex-column align-start">
            <div class="d-flex flex-md-column align-md-start justify-space-between mb-6 w-100">
              <div>
                <VBtn
                  :variant="checklist?.publicToken ? 'outlined' : undefined"
                  :append-icon="checklist?.publicToken ? '' : mdiShare"
                  @click="togglePublic"
                  >{{ checklist?.publicToken ? 'Закрыть доступ' : 'Поделиться' }}</VBtn
                >
                <p v-if="checklist?.publicToken" class="text-primary cursor-pointer mt-6" @click="copyLink">
                  Копировать ссылку <VIcon :icon="mdiContentCopy" />
                </p>
              </div>

              <VBtn color="red" class="mt-0 mt-md-16" variant="tonal" :loading="loading" @click="removeChecklist">Удалить</VBtn>
            </div>
            <p>
              Дата создания:
              <span class="font-weight-bold">{{ formatDateTime(checklist?.createdAt) }}</span>
            </p>
          </div>
        </div>
        <div class="list">
          <div class="d-flex justify-space-between align-center mb-6">
            <p class="text-h5">Список вещей</p>
            <div class="d-flex">
              <VBtn class="mr-2" size="small" :icon="mdiPlus" @click="visibilityFormAddItem = !visibilityFormAddItem" />
              <VBtn :icon="mdiDeleteOutline" size="small" variant="outlined" @click="removeMode = !removeMode" />
            </div>
          </div>

          <div v-for="(item, index) in checklist?.items" :key="item.id">
            <UserChecklistItem
              :id-checklist="idChecklist"
              :item="item"
              :remove-mode="removeMode"
              @set-checked="(event) => (item.isChecked = event)"
              @remove="() => checklist!.items.splice(index, 1)"
            />
          </div>

          <UserChecklistItemAdd
            v-if="visibilityFormAddItem"
            class="mt-6"
            :id-checklist="idChecklist"
            @cancel="visibilityFormAddItem = false"
            @create="addItem"
          />
        </div>
      </div>
    </div>
  </VContainer>
</template>

<script setup lang="ts">
  import { mdiContentCopy, mdiDeleteOutline, mdiPlus, mdiShare } from '@mdi/js';
  import type { UserChecklistItem } from '~/types/checklist';

  definePageMeta({
    middleware: 'auth'
  });

  const services = useServices();

  const { showSuccessToast } = useToast();

  const route = useRoute();

  const idChecklist = computed(() => Number(route.params.id));

  const removeMode = ref(false);

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
    showSuccessToast('Ссылка скопирована');
  };
</script>

<style scoped lang="scss">
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @media #{map.get(v.$display-breakpoints, 'md-and-up')} {
      grid-template-columns: minmax(100px, 500px) 500px;
    }
  }

  .list {
    grid-row: 1/2;
    margin-bottom: 32px;

    @media #{map.get(v.$display-breakpoints, 'md-and-up')} {
      grid-column: 2/3;
      margin-bottom: 0;
    }
  }
</style>
