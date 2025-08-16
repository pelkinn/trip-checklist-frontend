<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="inputId" class="base-input-label">
      {{ label }}
    </label>
    
    <div class="base-input-container">
      <input
        :id="inputId"
        ref="inputRef"
        v-model="inputValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :class="inputClasses"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
        @keydown="handleKeydown"
      />
      
      <div v-if="error" class="base-input-error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url'
  disabled?: boolean
  readonly?: boolean
  error?: string
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  type: 'text',
  disabled: false,
  readonly: false,
  size: 'medium'
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  input: [event: Event]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
  keydown: [event: KeyboardEvent]
}>()

const inputRef = ref<HTMLInputElement>()
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputValue = computed({
  get: () => String(props.modelValue || ''),
  set: (value: string) => emit('update:modelValue', value)
})

const inputClasses = computed(() => [
  'base-input',
  `base-input--${props.size}`,
  {
    'base-input--error': !!props.error,
    'base-input--disabled': props.disabled,
    'base-input--readonly': props.readonly
  }
])

const handleInput = (event: Event) => {
  emit('input', event)
}

const handleBlur = (event: FocusEvent) => {
  emit('blur', event)
}

const handleFocus = (event: FocusEvent) => {
  emit('focus', event)
}

const handleKeydown = (event: KeyboardEvent) => {
  emit('keydown', event)
}

// Expose focus method
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  select: () => inputRef.value?.select()
})
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.base-input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.base-input-container {
  position: relative;
}

.base-input {
  width: 100%;
  border: 2px solid var(--border-color);
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
