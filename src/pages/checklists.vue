<template>
  <div class="checklists-page">
    <!-- Header -->
    <LayoutAppHeader />

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <!-- Заголовок и кнопка создания -->
        <div class="page-header">
          <div class="page-title">
            <h1 class="page-title-text">Мои чеклисты</h1>
            <p class="page-subtitle">
              Управляйте своими персональными чеклистами путешествий
            </p>
          </div>

          <UiBaseButton
            variant="primary"
            size="large"
            @click="showCreateForm = true"
            :disabled="isLoading"
          >
            Создать чеклист
          </UiBaseButton>
        </div>

        <!-- Сообщение об ошибке -->
        <UiBaseAlert
          v-if="error"
          type="error"
          :message="error"
          @close="clearError"
          class="mb-4"
        />

        <!-- Загрузка -->
        <div v-if="isLoading && !hasChecklists" class="text-center py-8">
          <div class="loading-spinner mb-4"></div>
          <p class="text-body-1 text-secondary">Загружаем ваши чеклисты...</p>
        </div>

        <!-- Пустое состояние -->
        <div v-else-if="!hasChecklists" class="empty-state">
          <div class="empty-icon">📋</div>
          <h2 class="empty-title">У вас пока нет чеклистов</h2>
          <p class="empty-description">
            Создайте свой первый чеклист для путешествия, выбрав тип поездки и
            длительность
          </p>
          <UiBaseButton
            variant="primary"
            size="large"
            @click="showCreateForm = true"
          >
            Создать первый чеклист
          </UiBaseButton>
        </div>

        <!-- Список чеклистов -->
        <div v-else class="checklists-grid">
          <UiBaseCard
            v-for="checklist in userChecklists"
            :key="checklist.id"
            class="checklist-card"
            :elevation="2"
            @click="openChecklist(checklist.id)"
          >
            <div class="checklist-header">
              <h3 class="checklist-title">
                {{ getTripTypeName(checklist.checklist_id) }}
              </h3>
              <p class="checklist-date">
                Создан {{ formatDate(checklist.created_at) }}
              </p>
            </div>

            <div class="checklist-stats">
              <div class="stat-item">
                <span class="stat-label">Элементов:</span>
                <span class="stat-value">{{ checklist.items.length }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Выполнено:</span>
                <span class="stat-value">{{ completedItems(checklist) }}</span>
              </div>
            </div>

            <div class="checklist-actions">
              <UiBaseButton
                variant="outline"
                size="small"
                @click.stop="openChecklist(checklist.id)"
              >
                Открыть
              </UiBaseButton>
              <UiBaseButton
                variant="text"
                size="small"
                @click.stop="deleteChecklist(checklist.id)"
                :disabled="isLoading"
              >
                Удалить
              </UiBaseButton>
            </div>
          </UiBaseCard>
        </div>
      </div>
    </main>

    <!-- Модальное окно создания чеклиста -->
    <div
      v-if="showCreateForm"
      class="modal-overlay"
      @click="showCreateForm = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2 class="modal-title">Создать новый чеклист</h2>
          <button class="modal-close" @click="showCreateForm = false">×</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="createChecklist">
            <UiBaseSelect
              v-model="newChecklist.tripTypeId"
              :options="tripTypeOptions"
              label="Тип поездки"
              placeholder="Выберите тип поездки"
              required
              class="form-group"
            />

            <UiBaseSelect
              v-model="newChecklist.durationId"
              :options="durationOptions"
              label="Длительность"
              placeholder="Выберите длительность"
              required
              class="form-group"
            />

            <div class="form-actions">
              <UiBaseButton
                type="button"
                variant="outline"
                @click="showCreateForm = false"
                :disabled="isLoading"
              >
                Отмена
              </UiBaseButton>
              <UiBaseButton
                type="submit"
                variant="primary"
                :disabled="
                  isLoading ||
                  !newChecklist.tripTypeId ||
                  !newChecklist.durationId
                "
              >
                {{ isLoading ? 'Создание...' : 'Создать' }}
              </UiBaseButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  // Middleware для авторизованных пользователей
  definePageMeta({
    middleware: 'auth',
    requireAuth: true, // Явно указываем, что требуется авторизация
  })

  // Используем store для авторизации
  const authStore = useAuthStore()
  const { user } = storeToRefs(authStore)

  // Используем store для работы с чеклистами
  const checklistsStore = useChecklistsStore()
  const {
    userChecklists,
    tripTypes,
    durations,
    templateItems,
    isLoading,
    error,
    hasChecklists,
  } = storeToRefs(checklistsStore)

  // Состояние
  const showCreateForm = ref(false)
  const newChecklist = ref({
    tripTypeId: '',
    durationId: '',
  })

  // Загрузка данных при монтировании
  onMounted(async () => {
    await Promise.all([
      checklistsStore.fetchUserChecklists(),
      checklistsStore.fetchTripTypes(),
      checklistsStore.fetchDurations(),
    ])
  })

  // Создание нового чеклиста
  const createChecklist = async () => {
    if (!newChecklist.value.tripTypeId || !newChecklist.value.durationId) return

    try {
      // Сначала получаем шаблонный чеклист
      await checklistsStore.fetchTemplateChecklist(
        parseInt(newChecklist.value.tripTypeId),
        parseInt(newChecklist.value.durationId)
      )

      // Создаем пользовательский чеклист на основе шаблона
      const checklist = await checklistsStore.createUserChecklist({
        checklist_id: parseInt(newChecklist.value.tripTypeId), // Это будет ID типа поездки
        items: templateItems.value.map(item => item.id), // Добавляем все элементы из шаблона
        user_id: user.value?.id || 0,
      })

      if (checklist) {
        showCreateForm.value = false
        newChecklist.value = { tripTypeId: '', durationId: '' }
      }
    } catch (err: any) {
      // Ошибка уже обработана в store
    }
  }

  // Удаление чеклиста
  const deleteChecklist = async (id: number) => {
    if (confirm('Вы уверены, что хотите удалить этот чеклист?')) {
      try {
        await checklistsStore.deleteUserChecklist(id)
      } catch (err: any) {
        // Ошибка уже обработана в store
      }
    }
  }

  // Очистка ошибки
  const clearError = () => {
    checklistsStore.clearError()
  }

  // Открытие чеклиста
  const openChecklist = (id: number) => {
    navigateTo(`/checklists/${id}`)
  }

  // Подсчет выполненных элементов
  const completedItems = (checklist: any) => {
    return checklistsStore.getCompletedItems(checklist)
  }

  // Форматирование даты
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU')
  }

  // Получение названия типа поездки
  const getTripTypeName = (checklistId: number) => {
    return checklistsStore.getTripTypeName(checklistId)
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
    title: 'Мои чеклисты - Trip Checklist',
    meta: [
      {
        name: 'description',
        content: 'Управляйте своими персональными чеклистами путешествий',
      },
    ],
  })
</script>

<style scoped>
  .checklists-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .main-content {
    flex: 1;
    padding: 32px 0;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .page-title {
    flex: 1;
  }

  .page-title-text {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .page-subtitle {
    font-size: 16px;
    color: var(--text-secondary);
  }

  .empty-state {
    text-align: center;
    padding: 32px 0;
    max-width: 400px;
    margin: 0 auto;
  }

  .empty-icon {
    font-size: 64px;
    opacity: 0.5;
    margin-bottom: 16px;
  }

  .empty-title {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .empty-description {
    font-size: 16px;
    color: var(--text-secondary);
    margin-bottom: 24px;
  }

  .checklist-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }

  .checklist-date {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .modal-title {
    font-size: 20px;
    font-weight: 600;
  }

  .checklists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .checklist-card {
    cursor: pointer;
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .checklist-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  .checklist-header {
    margin-bottom: 16px;
  }

  .checklist-stats {
    margin-bottom: 16px;
  }

  .stat-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  .stat-label {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }

  .stat-value {
    font-weight: 600;
  }

  .checklist-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
  }

  .empty-state {
    max-width: 400px;
    margin: 0 auto;
  }

  .empty-icon {
    font-size: 64px;
    opacity: 0.5;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  /* Модальное окно */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .modal-content {
    background-color: white;
    border-radius: 8px;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    border-bottom: 1px solid var(--border-color);
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text-secondary);
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    color: var(--text-primary);
  }

  .modal-body {
    padding: 24px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-actions {
    display: flex;
    gap: 16px;
    justify-content: flex-end;
    margin-top: 32px;
  }

  @media (max-width: 768px) {
    .main-content {
      padding: 16px 0;
    }

    .checklists-grid {
      grid-template-columns: 1fr;
    }

    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .form-actions {
      flex-direction: column;
    }
  }
</style>
