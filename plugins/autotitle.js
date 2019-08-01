import Vue from 'vue'
Vue.mixin({
  data() {
    return {}
  },
  mounted() {
    this.$store.commit('SET_PAGE_TITLE', this.$meta().inject().titleChunk)
  },
  destroyed() {
    this.$store.commit('SET_PAGE_TITLE', 'Ranked Vote')
  }
})
