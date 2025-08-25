<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="base-card-header">
      <slot name="header" />
    </div>

    <div class="base-card-content">
      <slot />
    </div>

    <div v-if="$slots.footer" class="base-card-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
  interface Props {
    elevation?: 0 | 1 | 2 | 3 | 4 | 5
    padding?: 'none' | 'small' | 'medium' | 'large'
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    elevation: 1,
    padding: 'medium',
    hover: false,
  })

  const cardClasses = computed(() => [
    'base-card',
    `base-card--elevation-${props.elevation}`,
    `base-card--padding-${props.padding}`,
    {
      'base-card--hover': props.hover,
    },
  ])
</script>

<style scoped>
  .base-card {
    background-color: var(--background);
    border-radius: var(--border-radius);
    overflow: hidden;
    transition: var(--transition);
  }

  .base-card--hover:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-hover);
  }

  /* Elevations */
  .base-card--elevation-0 {
    box-shadow: none;
  }

  .base-card--elevation-1 {
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.12),
      0 1px 2px rgba(0, 0, 0, 0.24);
  }

  .base-card--elevation-2 {
    box-shadow:
      0 3px 6px rgba(0, 0, 0, 0.16),
      0 3px 6px rgba(0, 0, 0, 0.23);
  }

  .base-card--elevation-3 {
    box-shadow:
      0 10px 20px rgba(0, 0, 0, 0.19),
      0 6px 6px rgba(0, 0, 0, 0.23);
  }

  .base-card--elevation-4 {
    box-shadow:
      0 14px 28px rgba(0, 0, 0, 0.25),
      0 10px 10px rgba(0, 0, 0, 0.22);
  }

  .base-card--elevation-5 {
    box-shadow:
      0 19px 38px rgba(0, 0, 0, 0.3),
      0 15px 12px rgba(0, 0, 0, 0.22);
  }

  /* Padding */
  .base-card--padding-none .base-card-content {
    padding: 0;
  }

  .base-card--padding-small .base-card-content {
    padding: 1rem;
  }

  .base-card--padding-medium .base-card-content {
    padding: 1.5rem;
  }

  .base-card--padding-large .base-card-content {
    padding: 2rem;
  }

  .base-card-header {
    padding: 1.5rem 1.5rem 0;
    border-bottom: 1px solid var(--border-color);
  }

  .base-card-footer {
    padding: 0 1.5rem 1.5rem;
    border-top: 1px solid var(--border-color);
  }

  .base-card-content {
    padding: 1.5rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .base-card--padding-medium .base-card-content {
      padding: 1rem;
    }

    .base-card--padding-large .base-card-content {
      padding: 1.5rem;
    }

    .base-card-header {
      padding: 1rem 1rem 0;
    }

    .base-card-footer {
      padding: 0 1rem 1rem;
    }
  }
</style>
