<template>
  <v-app>
    <v-app-bar app dark color="blue" elevate-on-scroll>
      <nuxt-link to="/" class="toolbar-title">
        <v-toolbar-title class="headline text-uppercase">
          <span>Ranked</span>
          <span class="font-weight-light">
            Voting System
          </span>
        </v-toolbar-title>
      </nuxt-link>
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
  }
}
</script>
<style scoped>
.toolbar-title {
  color: inherit !important;
  text-decoration: inherit;
}
</style>
