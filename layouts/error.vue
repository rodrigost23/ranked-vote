<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <v-icon size="200">mdi-file-question</v-icon>
      </v-flex>

      <v-flex mb-4>
        <h1 class="display-2 font-weight-bold mb-3">
          {{ errorTitle }}
        </h1>
        <p class="subheading font-weight-regular">
          {{
            error.statusCode === 404
              ? "The page you are looking for doesn't exist."
              : 'There was an unknown error'
          }}
        </p>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: 'Page Not Found',
      otherError: 'An error occurred (' + this.error.statusCode + ')',
      errorTitle:
        this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    }
  },
  head() {
    const title = this.errorTitle
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
