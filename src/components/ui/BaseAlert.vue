<template>
  <div :class="alertClasses" role="alert">
    <div class="base-alert-icon" v-if="icon">
      <span class="base-alert-icon-text">{{ icon }}</span>
    </div>
    
    <div class="base-alert-content">
      <div v-if="title" class="base-alert-title">
        {{ title }}
      </div>
      <div class="base-alert-message">
        <slot />
      </div>
    </div>
    
    <button
      v-if="closable"
      class="base-alert-close"
      @click="handleClose"
      aria-label="Закрыть"
    >
      ×
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type?: 'info' | 'success' | 'warning' | 'error'
  title?: string
  icon?: string
  closable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  closable: false
})

const emit = defineEmits<{
  close: []
}>()

const alertClasses = computed(() => [
  'base-alert',
  `base-alert--${props.type}`
])

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.base-alert {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: var(--border-radius);
  border: 1px solid transparent;
  position: relative;
}

.base-alert-icon {
  flex-shrink: 0;
  margin-right: 0.75rem;
  margin-top: 0.125rem;
}

.base-alert-icon-text {
  font-size: 1.25rem;
  line-height: 1;
}

.base-alert-content {
  flex: 1;
  min-width: 0;
}

.base-alert-title {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.base-alert-message {
  line-height: 1.5;
}

.base-alert-close {
  flex-shrink: 0;
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  margin-left: 0.75rem;
  margin-top: -0.25rem;
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.base-alert-close:hover {
  opacity: 1;
}

/* Types */
.base-alert--info {
  background-color: rgba(102, 126, 234, 0.1);
  border-color: rgba(102, 126, 234, 0.2);
  color: #2c3e50;
}

.base-alert--info .base-alert-icon-text {
  color: var(--primary-color);
}

.base-alert--success {
  background-color: rgba(76, 175, 80, 0.1);
  border-color: rgba(76, 175, 80, 0.2);
  color: #2c3e50;
}

.base-alert--success .base-alert-icon-text {
  color: var(--success-color);
}

.base-alert--warning {
  background-color: rgba(255, 152, 0, 0.1);
  border-color: rgba(255, 152, 0, 0.2);
  color: #2c3e50;
}

.base-alert--warning .base-alert-icon-text {
  color: var(--warning-color);
}

.base-alert--error {
  background-color: rgba(244, 67, 54, 0.1);
  border-color: rgba(244, 67, 54, 0.2);
  color: #2c3e50;
}

.base-alert--error .base-alert-icon-text {
  color: var(--error-color);
}
</style>
