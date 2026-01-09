<template>
  <VContainer>
    <div v-if="pending" class="text-center py-8">
      <VProgressCircular indeterminate />
    </div>

    <div v-else>
      <UserChecklistHeader
        :id-checklist="idChecklist"
        :title="checklist?.name || checklist!.nameTripType"
        class="mb-6 mb-md-15"
        @change="(event: string) => (checklist!.name = event)"
      />
      <div class="grid">
        <div>
          <div class="d-flex flex-column align-start">
            <div class="d-flex flex-md-column align-md-start justify-space-between mb-6 w-100">
              <div>
                <VBtn
                  :variant="checklist?.isPublic ? 'outlined' : undefined"
                  :append-icon="checklist?.isPublic ? '' : mdiShare"
                  @click="togglePublic"
                  >{{ checklist?.isPublic ? 'Закрыть доступ' : 'Поделиться' }}</VBtn
                >
                <p v-if="checklist?.isPublic && checklist?.publicToken" class="text-primary cursor-pointer mt-6" @click="copyLink">
                  Копировать ссылку <VIcon :icon="mdiContentCopy" />
                </p>
              </div>

              <VBtn color="red" class="mt-0 mt-md-16" variant="tonal" @click="openDeleteDialog">Удалить</VBtn>
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
          </div>

          <Draggable v-model="checklist!.items" group="people" :animation="150" item-key="id" handle=".drag-handle" @change="onListChange">
            <template #item="{ element: item, index }">
              <div class="d-flex align-center mb-2">
                <VBtn :icon="mdiDragVertical" variant="text" density="compact" class="drag-handle" />
                <UserChecklistItem
                  :id-checklist="idChecklist"
                  :item="item"
                  @set-checked="(event) => (item.isChecked = event)"
                  @remove="() => checklist!.items.splice(index, 1)"
                />
              </div>
            </template>
          </Draggable>

          <VBtn v-if="!visibilityFormAddItem" class="mt-4" :prepend-icon="mdiPlus" @click="visibilityFormAddItem = !visibilityFormAddItem"
            >Добавить элемент</VBtn
          >

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
  import { LazyChecklistDeleteChecklistDialog } from '#components';
  import { mdiContentCopy, mdiDragVertical, mdiPlus, mdiShare } from '@mdi/js';
  import Draggable from 'vuedraggable';
  import type { UserChecklistItem } from '~/types/checklist';

  definePageMeta({
    middleware: 'auth'
  });

  const services = useServices();

  const { showSuccessToast } = useToast();

  const { openDialog } = useDialog();

  const route = useRoute();

  const idChecklist = computed(() => Number(route.params.id));

  const { pending, data: checklist } = useLazyAsyncData(() => {
    return services.checklist.getUserChecklist(idChecklist.value);
  });

  const loading = ref(false);

  const openDeleteDialog = () => {
    openDialog({
      component: LazyChecklistDeleteChecklistDialog,
      listeners: {
        confirm: removeChecklist
      }
    });
  };

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

  interface DraggableItem {
    id: string | number;
    [key: string]: any;
  }

  interface DragChangeEvent<T = DraggableItem> {
    moved: {
      newIndex: number;
      oldIndex: number;
      element: T;
    };
  }

  const onListChange = async (evt: DragChangeEvent) => {
    try {
      await services.checklist.updateUserChecklistItem(idChecklist.value, Number(evt.moved.element.id), { order: evt.moved.newIndex + 1 });
    } catch (err: any) {
      console.log(err);
    }
  };

  const visibilityFormAddItem = ref(false);
</script>

<style scoped lang="scss">
  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;

    @media #{map.get(v.$display-breakpoints, 'md-and-up')} {
      grid-template-columns: minmax(100px, 500px) 600px;
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
