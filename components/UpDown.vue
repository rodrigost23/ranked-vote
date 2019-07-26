<template>
  <v-layout>
    <v-flex>
      <span v-show="showUp">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              small
              :disabled="upDisabled"
              v-on="on"
              @click="$emit('up')"
            >
              <v-icon>mdi-chevron-up</v-icon>
            </v-btn>
          </template>
          <span>Move up</span>
        </v-tooltip>
      </span>
    </v-flex>
    <v-flex>
      <span v-show="showDown">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              icon
              small
              :disabled="downDisabled"
              v-on="on"
              @click="$emit('down')"
            >
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <span>Move down</span>
        </v-tooltip>
      </span>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  props: {
    showUp: {
      type: Boolean,
      default: true
    },
    showDown: {
      type: Boolean,
      default: true
    },
    upDisabled: {
      type: Boolean,
      default: false
    },
    downDisabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>
