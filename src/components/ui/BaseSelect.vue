<template>
  <div class="base-select">
    <label v-if="label" class="select-label">{{ label }}</label>
    <select
      :value="modelValue"
      @change="handleChange"
      class="select-input"
      :required="required"
      :disabled="disabled"
    >
      <option v-if="placeholder" value="">{{ placeholder }}</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
  interface SelectOption {
    value: string | number
    label: string
  }

  interface Props {
    modelValue: string | number
    options: SelectOption[]
    label?: string
    placeholder?: string
    required?: boolean
    disabled?: boolean
  }

  const props = defineProps<Props>()
  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
  }>()

  const handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement
    emit('update:modelValue', target.value)
  }
</script>

<style scoped>
  .base-select {
    display: flex;
    flex-direction: column;
  }

  .select-label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: var(--text-primary);
    font-size: 14px;
  }

  .select-input {
    width: 100%;
    padding: 12px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 16px;
    background-color: white;
    transition: border-color 0.2s ease;
    cursor: pointer;
  }

  .select-input:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(11, 116, 209, 0.1);
  }

  .select-input:disabled {
    background-color: var(--background-secondary);
    cursor: not-allowed;
    opacity: 0.6;
  }

  .select-input:hover:not(:disabled) {
    border-color: var(--primary-color);
  }
</style>
