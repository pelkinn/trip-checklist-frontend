// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'any', component: 'always' },
          svg: 'always',
          math: 'always'
        }
      ],
      'vue/block-order': ['error', { order: ['template', 'script', 'style'] }],
      'vue/custom-event-name-casing': ['error', 'camelCase', { ignores: ['/^[a-z]+(?:-[a-z]+)*:[a-z]+(?:-[a-z]+)*$/u'] }],
      'vue/define-macros-order': [
        'error',
        { order: ['definePageMeta', 'defineOptions', 'defineProps', 'defineEmits', 'defineModel', 'defineSlots'] }
      ],
      'vue/next-tick-style': ['error', 'promise'],
      'vue/no-boolean-default': ['error', 'no-default'],
      'vue/no-duplicate-attr-inheritance': 'error',
      'vue/no-empty-component-block': 'error',
      'vue/no-required-prop-with-default': ['error', { autofix: false }],
      'vue/padding-line-between-blocks': ['error', 'always'],
      'vue/prefer-define-options': 'error',
      'vue/require-macro-variable-name': [
        'error',
        { defineProps: 'props', defineEmits: 'emit', defineSlots: 'slots', useSlots: 'slots', useAttrs: 'attrs' }
      ],
      'vue/require-typed-ref': 'error'
    }
  }
);
