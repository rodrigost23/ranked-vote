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
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  plugins: [
    'prettier',
    'vuetify'
  ],
  // add your custom rules here
  rules: {
    "no-console": "warn",
    "space-before-function-paren": 0,
    "vue/singleline-html-element-content-newline": ["warn", {
      "ignoreWhenNoAttributes": true,
      "ignoreWhenEmpty": true,
      "ignores": ["pre", "textarea", "v-icon"]
    }],
    'vuetify/no-deprecated-classes': 'error'
    // 'vuetify/grid-unknown-attributes': 'error',
    // 'vuetify/no-legacy-grid': 'error'
  }
}
