<template>
  <v-app>
    <v-app-bar app dark color="blue" elevate-on-scroll>
      <router-link to="/" class="toolbar-title">
        <v-toolbar-title class="headline text-uppercase">
          <span>Ranked</span>
          <span class="font-weight-light">Voting System</span>
        </v-toolbar-title>
      </router-link>
      <v-spacer></v-spacer>
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
      <v-container fluid :class="{'pa-0': $vuetify.breakpoint.xs}">
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import VueRouter from "vue-router";
// import Home from './components/Home';
const Home = () => import("./components/Home");
const Edit = () => import("./components/Edit");
const NotFound = () => import("./components/NotFound");

const router = new VueRouter({
  mode: "history",
  base: __dirname,
  routes: [
    { path: "/", component: Home },
    { path: "/new", component: Edit },
    { path: "/:id", component: Edit },
    { path: "*", component: NotFound }
  ]
});

export default {
  name: "App",
  router,
  created() {
    this.$vuetify.lang.current = navigator.language.split("-")[0];
  },
  data() {
    return {};
  }
};
</script>
<style>
.toolbar-title {
  color: inherit !important;
  text-decoration: inherit;
}
</style>

