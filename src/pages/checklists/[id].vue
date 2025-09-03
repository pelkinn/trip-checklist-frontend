<template>
  <VContainer>
    <div v-if="pending" class="text-center py-8">
      <VProgressCircular indeterminate />
    </div>

    {{ data }}
  </VContainer>
</template>

<script setup lang="ts">
  definePageMeta({
    middleware: 'auth',
  })

  const services = useServices()

  const route = useRoute()

  const { pending, data } = useLazyAsyncData(() => {
    return services.checklist.getUserChecklist(Number(route.params.id))
  })
</script>
