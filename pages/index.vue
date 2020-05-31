<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <v-img src="/icon.png" height="300px" contain />
      </v-flex>

      <v-flex>
        <h1 class="display-2 font-weight-bold mb-3">
          Ranked voting system
        </h1>
        <p class="subheading font-weight-regular" mb-4>
          Create democratic polls for everyone
        </p>
        <v-btn
          x-large
          dark
          rounded
          :color="$vuetify.theme.currentTheme.accent"
          to="/new"
          nuxt
        >
          New poll
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {}
  },
  head() {
    return {
      title: 'Home'
    }
  }
}
</script>
