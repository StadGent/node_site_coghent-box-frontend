module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/typescript'],
  rules: {
    'vue/no-multiple-template-root': 'off',
    'no-unused-vars': 'off',
    'one-component-per-file': 'off'
  },
  plugins: ['vue']
}

