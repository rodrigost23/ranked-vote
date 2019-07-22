import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    [
      'nuxt-fire',
      {
        // Required:
        config: {
          development: {
            apiKey: process.env.FIREBASE_KEY,
            authDomain: 'ranked-vote.firebaseapp.com',
            databaseURL: 'https://ranked-vote.firebaseio.com',
            projectId: 'ranked-vote',
            storageBucket: 'ranked-vote.appspot.com',
            messagingSenderId: '169315955849',
            appId: '1:169315955849:web:f34f758bb22da748'
          },
          production: {
            apiKey: process.env.FIREBASE_KEY,
            authDomain: 'ranked-vote.firebaseapp.com',
            databaseURL: 'https://ranked-vote.firebaseio.com',
            projectId: 'ranked-vote',
            storageBucket: 'ranked-vote.appspot.com',
            messagingSenderId: '169315955849',
            appId: '1:169315955849:web:f34f758bb22da748'
          }
        },
        // The following options are optional:
        useOnly: [
          // 'auth',
          'firestore'
          // 'functions',
          // 'storage',
          // 'realtimeDb',
          // 'messaging'
        ],
        customEnv: false,
        functionsLocation: 'us-east1'
      }
    ]
  ],
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    theme: {
      primary: colors.blue.darken2,
      accent: colors.grey.darken3,
      secondary: colors.amber.darken3,
      info: colors.teal.lighten1,
      warning: colors.amber.base,
      error: colors.deepOrange.accent4,
      success: colors.green.accent3
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    }
  }
}
