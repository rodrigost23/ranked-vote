import colors from 'vuetify/es5/util/colors'
/** @type {import("@nuxt/types").Configuration} */
const config = {
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
  /*
   ** PWA configurations
   */
  pwa: {
    manifest: {
      name: 'Ranked Vote',
      mobileAppIOS: true,
      theme_color: colors.blue.accent3
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: colors.blue.accent4 },
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
      '@nuxtjs/firebase',
      {
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
        services: {
          auth: true,
          firestore: true
          // 'functions',
          // 'storage',
          // 'realtimeDb',
          // 'messaging'
        },
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
      themes: {
        light: {
          primary: colors.blue.accent3,
          accent: colors.blue.accent4,
          secondary: colors.blue.accent4,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        dark: {
          primary: colors.grey.darken4,
          accent: colors.blue.accent2,
          secondary: colors.grey.darken3
        }
      }
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

export default config
