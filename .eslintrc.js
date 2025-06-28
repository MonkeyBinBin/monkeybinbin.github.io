module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: '@babel/eslint-parser',
    requireConfigFile: false
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: [],
  rules: {
    'vue/no-v-html': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'warn'
  },
  globals: {
    $: 'readonly',
    moment: 'readonly'
  }
}
