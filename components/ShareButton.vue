<template>
  <v-menu :close-on-content-click="false" offset-x>
    <template v-slot:activator="{ on }">
      <v-btn icon small v-on="on">
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="subtitle-2">
        Share link to this poll
      </v-card-title>
      <v-card-text>
        <v-text-field
          ref="shareText"
          single-line
          outlined
          solo
          flat
          readonly
          :value="value"
          hide-details
          append-icon="mdi-content-copy"
          @focus="$event.target.select()"
          @click:append="copy"
        ></v-text-field>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  methods: {
    copy() {
      const input = this.$refs.shareText
      input.focus()
      document.execCommand('selectAll')
      this.copied = document.execCommand('copy')
    }
  }
}
</script>
