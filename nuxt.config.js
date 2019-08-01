import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + 'Ranked Vote',
    title: 'Ranked Vote',
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  manifest: {
    name: 'Ranked Vote'
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: colors.blue.darken2 },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['~/plugins/autotitle'],
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
          'auth',
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
        // config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map'
      }
    },
    parallel: true,
    transpile: [/^vuetify/]
  }
}
