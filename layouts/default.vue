<template>
  <v-app>
    <v-app-bar
      app
      :dark="!isHome"
      :color="isHome ? 'transparent' : 'primary'"
      elevate-on-scroll
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
