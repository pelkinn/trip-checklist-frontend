<template>
  <div class="home-page">
    <!-- Header -->
    <LayoutAppHeader />

    <!-- Main Content -->
    <main class="main">
      <VContainer class="container">
        <div class="d-flex flex-column align-center">
          <div class="welcome-content">
            <h1 class="text-primary">Trip Checklist</h1>
            <p>
              Зарегистрируйтесь, чтобы создавать удобные чек-листы для любых
              поездок: выбирайте готовые шаблоны под разные типы путешествий и
              продолжительность, добавляйте свои пункты и отслеживайте прогресс
              сборов
            </p>
          </div>

          <VCard class="search" elevation="4">
            <VSelect
              v-model="searchForm.tripTypeId"
              :options="tripTypes"
              label="Тип поездки"
              :items="tripTypes"
              item-value="id"
              item-title="name"
            />

            <VSelect
              v-model="searchForm.durationId"
              :options="durations"
              label="Длительность"
              :items="durations"
              item-value="id"
              item-title="label"
            />

            <VBtn
              color="secondary"
              :loading="loadingSearch"
              @click="searchTemplate"
            >
              Показать
            </VBtn>
          </VCard>

          <div v-if="templateItems.length > 0">
            <VList class="mb-6">
              <VListItem
                v-for="item in templateItems"
                :key="item.id"
                class="template-item"
              >
                <span class="font-weight-medium">{{ item.name }}</span>
              </VListItem>
            </VList>

            <VBtn @click="handleCreateChecklist"> Создать мой чеклист </VBtn>
          </div>

          <img v-else src="/assets/images/img4.webp" alt="" class="img" />
        </div>
      </VContainer>
    </main>
  </div>
</template>

<script setup lang="ts">
  const authStore = useAuthStore()
  const { user, isAuthenticated } = storeToRefs(authStore)

  const checklistsStore = useChecklistsStore()
  const { tripTypes, durations, templateItems, isLoading, error } =
    storeToRefs(checklistsStore)

  const searchForm = ref({
    tripTypeId: null,
    durationId: null,
  })

  const loadingSearch = ref(false)

  onMounted(async () => {
    await Promise.all([
      checklistsStore.fetchTripTypes(),
      checklistsStore.fetchDurations(),
    ])
  })

  const searchTemplate = async () => {
    if (!searchForm.value.tripTypeId || !searchForm.value.durationId) return

    loadingSearch.value = true

    try {
      await checklistsStore.fetchTemplateChecklist(
        searchForm.value.tripTypeId,
        searchForm.value.durationId
      )
    } catch (err: any) {
      console.log(err)
    } finally {
      loadingSearch.value = false
    }
  }

  const handleCreateChecklist = () => {
    if (isAuthenticated.value) {
      navigateTo('/checklists')
    } else {
      navigateTo('/auth')
    }
  }

  useHead({
    title: 'Trip Checklist - Персональные чеклисты путешествий',
    meta: [
      {
        name: 'description',
        content: 'Создавайте персональные чеклисты для ваших путешествий',
      },
    ],
  })
</script>

<style scoped>
  .welcome-content {
    max-width: 650px;
    text-align: center;
    margin-bottom: 32px;
  }

  .search {
    display: grid;
    grid-template-columns: 1fr 1fr max-content;
    gap: 16px;
    width: 100%;
    max-width: 1000px;
    padding: 24px;
    margin-bottom: 32px;
  }

  .img {
    max-width: 500px;
  }
</style>
