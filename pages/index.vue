<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <vuetify-logo />
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          Ranked voting system
        </h1>
        <p class="subheading font-weight-regular">
          Create democratic polls for everyone
        </p>
        <v-btn dark color="blue" to="/new" nuxt>
          New poll
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import VuetifyLogo from '~/components/VuetifyLogo.vue'
export default {
  components: {
    VuetifyLogo
  },
  data() {
    return {}
  }
}
</script>
