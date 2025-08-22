<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :type="type"
    @click="handleClick"
  >
    <span v-if="loading" class="button-loader" />
    <span v-else class="button-content">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: "primary" | "secondary" | "outline" | "text" | "error";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
  type?: "button" | "submit" | "reset";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "medium",
  disabled: false,
  loading: false,
  block: false,
  type: "button",
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const buttonClasses = computed(() => [
  "base-button",
  `base-button--${props.variant}`,
  `base-button--${props.size}`,
  {
    "base-button--block": props.block,
    "base-button--disabled": props.disabled,
    "base-button--loading": props.loading,
  },
]);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: var(--border-radius);
  font-family: inherit;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: var(--transition);
  position: relative;
  overflow: hidden;
}

.base-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.base-button--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button--block {
  width: 100%;
}

/* Variants */
.base-button--primary {
  background-color: var(--primary-color);
  color: white;
}

.base-button--primary:hover:not(.base-button--disabled) {
  background-color: var(--primary-dark);
  box-shadow: var(--shadow-hover);
}

.base-button--secondary {
  background-color: var(--secondary-color);
  color: white;
}

.base-button--secondary:hover:not(.base-button--disabled) {
  background-color: #9a5318;
  box-shadow: var(--shadow-hover);
}

.base-button--outline {
  background-color: transparent;
  color: var(--primary-color);
  border: 2px solid var(--primary-color);
}

.base-button--outline:hover:not(.base-button--disabled) {
  background-color: var(--primary-color);
  color: white;
}

.base-button--text {
  background-color: transparent;
  color: var(--primary-color);
  padding: 0;
}

.base-button--text:hover:not(.base-button--disabled) {
  background-color: rgba(102, 126, 234, 0.1);
}

.base-button--error {
  background-color: var(--error-color);
  color: white;
}

.base-button--error:hover:not(.base-button--disabled) {
  background-color: #d32f2f;
  box-shadow: var(--shadow-hover);
}

/* Sizes */
.base-button--small {
  padding: 8px 16px;
  font-size: 0.875rem;
  min-height: 32px;
}

.base-button--medium {
  padding: 12px 24px;
  font-size: 1rem;
  min-height: 40px;
}

.base-button--large {
  padding: 16px 32px;
  font-size: 1.125rem;
  min-height: 48px;
}

/* Loading state */
.base-button--loading .button-content {
  opacity: 0;
}

.button-loader {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}
</style>
