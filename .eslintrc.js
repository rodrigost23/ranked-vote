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
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'prettier',
    'vuetify'
  ],
  // add your custom rules here
  rules: {
    "prettier/prettier": "warn",
    "no-console": "warn",
    "vue/singleline-html-element-content-newline": ["warn", {
      "ignoreWhenNoAttributes": true,
      "ignoreWhenEmpty": true,
      "ignores": ["pre", "textarea", "v-icon", "span", "h1", "h2", "h3", "h4", "h5"]
    }],
    "vue/multiline-html-element-content-newline": ["warn", {
      "ignores": ["v-icon"]
    }],
    'vuetify/no-deprecated-classes': 'error'
    // 'vuetify/grid-unknown-attributes': 'error',
    // 'vuetify/no-legacy-grid': 'error'
  }
}
