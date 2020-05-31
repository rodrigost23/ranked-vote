import Vue from 'vue'

export default ({ store }) => {
  Vue.mixin({
    data() {
      return {}
    },
    destroyed() {
      store.commit('SET_PAGE_TITLE', 'Ranked Vote')
    },
    head() {
      return {
        changed() {
          if (store) {
            store.commit('SET_PAGE_TITLE', this.titleChunk)
          }
        }
      }
    }
  })
}
