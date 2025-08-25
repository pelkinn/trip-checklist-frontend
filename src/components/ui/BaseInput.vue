<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="id" class="base-input-label">
      {{ label }}
    </label>

    <div class="base-input-container">
      <input
        :id="id"
        ref="inputRef"
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
      />

      <div v-if="error" class="base-input-error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
    disabled?: boolean
    readonly?: boolean
    error?: string
    size?: 'small' | 'medium' | 'large'
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 'text',
    disabled: false,
    readonly: false,
    size: 'medium',
    error: '',
    placeholder: '',
    label: '',
  })

  const model = defineModel<string | number | null>({ default: '' })

  const inputClasses = computed(() => [
    'base-input',
    `base-input--${props.size}`,
    {
      'base-input--error': !!props.error,
      'base-input--disabled': props.disabled,
      'base-input--readonly': props.readonly,
    },
  ])

  const id = useId()
</script>

<style scoped>
  .base-input-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .base-input-label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-primary);
  }

  .base-input-container {
    position: relative;
  }

  .base-input {
    width: 100%;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background-color: var(--background);
    color: var(--text-primary);
    font-family: inherit;
    font-size: inherit;
    transition: var(--transition);
    outline: none;
  }

  .base-input:focus {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .base-input--error {
    border-color: var(--error-color);
  }

  .base-input--error:focus {
    border-color: var(--error-color);
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
  }

  .base-input--disabled {
    background-color: var(--background-secondary);
    color: var(--text-light);
    cursor: not-allowed;
  }

  .base-input--readonly {
    background-color: var(--background-secondary);
  }

  /* Sizes */
  .base-input--small {
    padding: 8px 12px;
    font-size: 0.875rem;
    min-height: 32px;
  }

  .base-input--medium {
    padding: 12px 16px;
    font-size: 1rem;
    min-height: 40px;
  }

  .base-input--large {
    padding: 16px 20px;
    font-size: 1.125rem;
    min-height: 48px;
  }

  .base-input-error {
    color: var(--error-color);
    font-size: 0.75rem;
    margin-top: 0.25rem;
    font-weight: 500;
  }

  /* Placeholder */
  .base-input::placeholder {
    color: var(--text-light);
    opacity: 1;
  }

  /* Disabled placeholder */
  .base-input--disabled::placeholder {
    color: var(--text-light);
    opacity: 0.5;
  }
</style>
