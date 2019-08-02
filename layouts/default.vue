<template>
  <v-app>
    <v-app-bar
      app
      dark
      :color="isHome ? 'transparent' : $vuetify.theme.currentTheme.primary"
      :elevate-on-scroll="!isHome"
      :flat="isHome"
    >
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-fade-transition>
            <v-btn v-if="!isHome" to="/" nuxt icon v-on="on">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </v-fade-transition>
        </template>
        <span>Go to homepage</span>
      </v-tooltip>
      <v-toolbar-title v-if="!isHome">
        {{ $store.state.pageTitle }}
      </v-toolbar-title>
      <v-spacer />
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on" @click="toggleDark">
            <v-icon>mdi-brightness-4</v-icon>
          </v-btn>
        </template>
        <span>Toggle theme</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon>language</v-icon>
          </v-btn>
        </template>
        <span>Change language</span>
      </v-tooltip>
    </v-app-bar>

    <v-content>
      <v-container fluid :class="{ 'pa-0': $vuetify.breakpoint.xs }">
        <v-fade-transition mode="out-in">
          <nuxt />
        </v-fade-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {
    isHome() {
      return this.$route.path === '/'
    },
    isDark() {
      return this.$vuetify.theme.dark
    }
  },
  created() {
    this.$vuetify.theme.dark = !!localStorage.dark
    this.$store.subscribe((mutation, state) => {
      switch (mutation.type) {
        case 'SET_THEME_DARK':
        case 'SET_THEME_LIGHT':
          this.$vuetify.theme.dark = state.dark
      }
    })
  },
  methods: {
    toggleDark() {
      if (this.isDark) {
        localStorage.dark = false
        this.$vuetify.theme.dark = false
      } else {
        localStorage.dark = true
        this.$vuetify.theme.dark = true
      }
    }
  }
}
</script>
<style scoped>
.toolbar-title {
  color: inherit !important;
  text-decoration: inherit;
}
</style>
