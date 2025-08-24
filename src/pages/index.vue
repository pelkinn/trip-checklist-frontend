<template>
  <div class="home-page">
    <!-- Header -->
    <LayoutAppHeader />

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- Заголовок -->
          <div class="welcome-content">
            <h1 class="welcome-title">Trip Checklist</h1>
            <p class="welcome-subtitle">
              Зарегистрируйтесь, чтобы создавать удобные чек-листы для любых
              поездок: выбирайте готовые шаблоны под разные типы путешествий и
              продолжительность, добавляйте свои пункты и отслеживайте прогресс
              сборов
            </p>

            <!-- Кнопки для авторизованных пользователей -->
            <div v-if="isAuthenticated" class="user-actions">
              <UiBaseButton
                variant="primary"
                size="large"
                @click="goToChecklists"
              >
                Мой личный кабинет
              </UiBaseButton>
            </div>
          </div>

          <!-- Поиск шаблонных чеклистов (для всех пользователей) -->
          <!-- Поиск шаблонных чеклистов -->
          <form class="search-form" @submit.prevent="searchTemplate">
            <div class="form-row">
              <div class="select-row">
                <UiBaseSelect
                  v-model="searchForm.tripTypeId"
                  :options="tripTypeOptions"
                  placeholder="Тип поездки"
                  required
                />

                <UiBaseSelect
                  v-model="searchForm.durationId"
                  :options="durationOptions"
                  placeholder="Длительность"
                  required
                />
              </div>

              <UiBaseButton
                type="submit"
                variant="secondary"
                size="medium"
                :disabled="
                  isLoading || !searchForm.tripTypeId || !searchForm.durationId
                "
                class="search-button"
              >
                {{ isLoading ? 'Поиск...' : 'Показать' }}
              </UiBaseButton>
            </div>
          </form>
          <!-- Сообщение об ошибке -->
          <UiBaseAlert
            v-if="error"
            type="error"
            icon="⚠️"
            closable
            class="mb-4"
            @close="checklistsStore.clearError()"
          >
            {{ error }}
          </UiBaseAlert>

          <!-- Сообщение "не найдено" -->
          <UiBaseAlert
            v-if="isNotFound"
            type="info"
            icon="🔍"
            closable
            class="mb-4"
            @close="isNotFound = false"
          >
            Чеклист для выбранных параметров не найден. Попробуйте другие
            варианты типа поездки или длительности.
          </UiBaseAlert>

          <!-- Результаты поиска -->
          <div v-if="templateItems.length > 0" class="results-section">
            <div class="results-header">
              <h3 class="results-title">
                Чеклист для {{ getTripTypeName(searchForm.tripTypeId) }} ({{
                  getDurationLabel(searchForm.durationId)
                }})
              </h3>
              <p class="results-count">{{ templateItems.length }} элементов</p>
            </div>

            <div class="template-items">
              <div
                v-for="item in templateItems"
                :key="item.id"
                class="template-item"
              >
                <span class="item-icon">📋</span>
                <span class="item-name">{{ item.name }}</span>
              </div>
            </div>

            <div class="results-actions">
              <UiBaseButton
                variant="primary"
                size="large"
                @click="handleCreateChecklist"
              >
                Создать мой чеклист
              </UiBaseButton>
              <UiBaseButton variant="outline" size="large" @click="clearSearch">
                Новый поиск
              </UiBaseButton>
            </div>
          </div>

          <img v-else src="/assets/images/img4.webp" alt="" class="img" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
  // Используем store для авторизации
  const authStore = useAuthStore()
  const { user, isAuthenticated } = storeToRefs(authStore)

  // Используем store для работы с чеклистами
  const checklistsStore = useChecklistsStore()
  const { tripTypes, durations, templateItems, isLoading, error } =
    storeToRefs(checklistsStore)

  // Локальное состояние для "не найдено"
  const isNotFound = ref(false)

  // Состояние для поиска
  const searchForm = ref({
    tripTypeId: '',
    durationId: '',
  })

  // Загрузка данных при монтировании
  onMounted(async () => {
    await Promise.all([
      checklistsStore.fetchTripTypes(),
      checklistsStore.fetchDurations(),
    ])
  })

  // Поиск шаблонного чеклиста
  const searchTemplate = async () => {
    if (!searchForm.value.tripTypeId || !searchForm.value.durationId) return

    // Очищаем предыдущие ошибки и состояние "не найдено" перед новым поиском
    checklistsStore.clearError()
    isNotFound.value = false

    try {
      await checklistsStore.fetchTemplateChecklist(
        parseInt(searchForm.value.tripTypeId),
        parseInt(searchForm.value.durationId)
      )
    } catch (err: any) {
      if (err.notFound) {
        isNotFound.value = true
      }
    }
  }

  // Очистка поиска
  const clearSearch = () => {
    searchForm.value = { tripTypeId: '', durationId: '' }
    checklistsStore.clearCurrentChecklist()
    checklistsStore.clearError()
    isNotFound.value = false
  }

  // Получение названия типа поездки
  const getTripTypeName = (checklistId: string | number) => {
    const id =
      typeof checklistId === 'string' ? parseInt(checklistId) : checklistId
    return checklistsStore.getTripTypeName(id)
  }

  // Получение названия длительности
  const getDurationLabel = (durationId: string | number) => {
    const id =
      typeof durationId === 'string' ? parseInt(durationId) : durationId
    return checklistsStore.getDurationLabel(id)
  }

  // Обработка создания чеклиста
  const handleCreateChecklist = () => {
    if (isAuthenticated.value) {
      // Если пользователь авторизован, переходим на страницу чеклистов
      navigateTo('/checklists')
    } else {
      // Если не авторизован, переходим на страницу авторизации
      navigateTo('/auth')
    }
  }

  // Переход на страницу авторизации
  const goToAuth = () => {
    navigateTo('/auth')
  }

  // Переход в личный кабинет
  const goToChecklists = () => {
    navigateTo('/checklists')
  }

  // Преобразование данных для селектов
  const tripTypeOptions = computed(() =>
    tripTypes.value.map(type => ({
      value: String(type.id),
      label: type.name,
    }))
  )

  const durationOptions = computed(() =>
    durations.value.map(duration => ({
      value: String(duration.id),
      label: duration.label,
    }))
  )

  // Устанавливаем мета-теги для страницы
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
  .home-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 0;
  }

  .content-wrapper {
    padding: 0 100px;
    width: 100%;
  }

  .welcome-content {
    text-align: center;
    margin-bottom: 48px;
  }

  .welcome-title {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 16px;
    color: var(--primary-color);
  }

  .welcome-subtitle {
    font-size: 18px;
    color: var(--text-secondary);
    line-height: 1.5;
    margin-bottom: 24px;
    padding: 0 150px;
  }

  .user-actions {
    text-align: center;
    margin-top: 24px;
  }

  .search-form {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    padding: 30px;
    border-radius: 10px;
    margin-bottom: 20px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 10%;
    gap: 20px;
  }

  .select-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .form-group {
    margin-bottom: 0;
  }

  .search-button {
    width: 100%;
  }

  .results-section {
    max-width: 500px;
    margin: 0 auto;
    padding: 24px;
    background-color: var(--background-secondary);
    border-radius: 12px;
  }

  .results-header {
    margin-bottom: 20px;
    text-align: center;
  }

  .results-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .results-count {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .img {
    display: block;
    margin: 0 auto;
    padding: 50px;
    max-width: 400px;
  }

  .template-items {
    margin-bottom: 24px;
  }

  .template-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background-color: white;
    border-radius: 8px;
    margin-bottom: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .template-item:last-child {
    margin-bottom: 0;
  }

  .item-icon {
    font-size: 18px;
    margin-right: 12px;
  }

  .item-name {
    font-weight: 500;
    font-size: 14px;
  }

  .results-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 16px 0;
    }

    .content-wrapper {
      padding: 0 16px;
    }

    .welcome-title {
      font-size: 28px;
    }

    .welcome-subtitle {
      font-size: 16px;
    }

    .form-row {
      grid-template-columns: 1fr;
    }

    .results-actions {
      flex-direction: column;
    }

    .results-section {
      margin: 0 16px;
    }
  }
</style>
