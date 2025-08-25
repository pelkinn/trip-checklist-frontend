<template>
  <div class="base-select">
    <label v-if="label" :id="id" class="bs-label">{{ label }}</label>

    <div class="bs-control" @click="toggle">
      <span class="bs-value">
        {{ selected ? selected.label : placeholder }}
      </span>
      <span class="bs-caret">▾</span>
    </div>

    <ul v-if="isOpen" :id="id" class="bs-list">
      <li
        v-for="opt in normalizedOptions"
        :key="opt.value"
        class="bs-option"
        @click="select(opt)"
      >
        {{ opt.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  type Option = { label: string; value: string | number } | string

  const props = defineProps<{
    modelValue: string | number | null
    label?: string
    placeholder?: string
    options: Option[]
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string | number | null): void
  }>()

  const isOpen = ref(false)

  const normalizedOptions = computed(() =>
    props.options.map((o): { label: string; value: string | number } =>
      typeof o === 'string' ? { label: o, value: o } : o
    )
  )

  const selected = computed(
    () =>
      normalizedOptions.value.find(o => o.value === props.modelValue) || null
  )

  function toggle(): void {
    isOpen.value = !isOpen.value
  }

  function select(option: { label: string; value: string | number }): void {
    emit('update:modelValue', option.value)
    isOpen.value = false
  }

  const id = useId()
</script>

<style scoped>
  .base-select {
    display: inline-flex;
    flex-direction: column;
    position: relative;
  }
  .bs-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
  }
  .bs-control {
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--background);
    color: var(--text-primary);
    padding: 6px 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bs-value {
    color: var(--text-primary);
  }
  .bs-caret {
    font-size: 12px;
  }
  .bs-list {
    padding: 0;
    list-style: none;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: #fff;
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    z-index: 5;
  }
  .bs-option {
    padding: 6px 8px;
    cursor: pointer;
  }
  .bs-option:hover {
    background: #f3f3f3;
  }
</style>
