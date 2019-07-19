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
    { path: "/", component: Home, meta: { title: "Home Page" } },
    { path: "/new", component: Edit, meta: { title: "New Poll" } },
    { path: "/:id", component: Edit, meta: { title: "Edit Poll" } },
    { path: "*", component: NotFound, meta: { title: "Page not found" } }
  ]
});

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find(r => r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find(r => r.meta.metaTags);
  // const previousNearestWithMeta = from.matched
  //   .slice()
  //   .reverse()
  //   .find(r => r.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) {
    var title = nearestWithTitle.meta.title;
    document.title = title + " | " + process.env.VUE_APP_TITLE;
    document.querySelector("meta[name='og:title']").setAttribute("content", title);
    document.querySelector("meta[name='twitter:title']").setAttribute("content", title);
  }

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll("[data-vue-router-controlled]")).map(
    el => el.parentNode.removeChild(el)
  );

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map(tagDef => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach(key => {
        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach(tag => document.head.appendChild(tag));

  next();
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

