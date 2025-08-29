<template>
  <VCard :elevation="3" class="rounded-lg pa-6">
    <h2 class="text-h5 mb-6">Восстановление пароля</h2>

    <VForm class="mb-6" @submit.prevent="handleSubmit">
      <v-text-field
        v-model="form.email"
        label="Email"
        type="email"
        @blur="validateEmailField"
        @input="validateEmailField"
      />

      <VBtn
        type="submit"
        color="secondary"
        size="large"
        :loading="isLoading"
        block
      >
        Восстановить
      </VBtn>
    </VForm>

    <p
      class="text-body-2 text-primary cursor-pointer"
      @click="emit('back-to-login')"
    >
      Войти
    </p>
  </VCard>
</template>

<script setup lang="ts">
  const emit = defineEmits<{
    (e: 'back-to-login'): void
  }>()

  const authStore = useAuthStore()
  const { isLoading } = storeToRefs(authStore)
  const isSuccess = ref(false)

  const form = reactive({
    email: '',
  })

  const errors = reactive({
    email: '',
  })

  const clearValidationErrors = () => {
    errors.email = ''
  }

  const validateEmail = (email: string): string => {
    if (!email) return 'Email обязателен'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return 'Введите корректный email'
    return ''
  }

  const validateEmailField = () => {
    errors.email = validateEmail(form.email)
  }

  const validateForm = (): boolean => {
    clearValidationErrors()

    errors.email = validateEmail(form.email)

    return !errors.email
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    await authStore.forgotPassword(form.email)

    if (!authStore.error) {
      isSuccess.value = true
      form.email = ''
    }
  }
</script>
