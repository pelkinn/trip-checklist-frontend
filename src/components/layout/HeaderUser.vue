<template>
  <VMenu>
    <template #activator="{ props }">
      <div v-if="xs">
        <VBtn v-bind="props" :icon="mdiAccountCircleOutline" size="large" />
      </div>

      <VBtn v-else v-bind="props" class="px-3" variant="text">
        <VIcon size="32" start>{{ mdiAccountCircleOutline }}</VIcon>
        {{ user?.email }}
        <VIcon end>{{ mdiMenuDown }}</VIcon>
      </VBtn>
    </template>

    <VCard>
      <template v-if="xs">
        <div class="px-4 py-2 font-weight-medium">{{ user?.email }}</div>
        <VDivider />
      </template>
      <VList density="compact">
        <VListItem v-for="item in menu" :key="item.title" v-bind="item.props" :prepend-icon="item.icon" :title="item.title" />
      </VList>
      <VDivider />
      <VBtn :append-icon="mdiExitToApp" block @click="logoutFn">Выйти</VBtn>
    </VCard>
  </VMenu>
</template>

<script lang="ts" setup>
  import { mdiAccountCircleOutline, mdiExitToApp, mdiListBoxOutline, mdiMenuDown } from '@mdi/js';
  import { useDisplay } from 'vuetify';

  const { xs } = useDisplay();
  const authStore = useUserStore();
  const { user } = storeToRefs(authStore);
  const { logout } = authStore;

  const menu = computed(() => [
    {
      icon: mdiListBoxOutline,
      title: 'Мои чеклисты',
      props: { to: '/checklists' }
    }
  ]);

  const logoutFn = () => {
    logout();
    location.href = '/';
  };
</script>
