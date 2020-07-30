module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended',
    'standard'
  ],
  plugins: [],
  rules: {
    'vue/no-v-html': 'off'
  },
  globals: {
    $: 'readonly',
    moment: 'readonly'
  }
}
