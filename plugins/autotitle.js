import Vue from 'vue'

export default ({ store }) => {
  Vue.mixin({
    data() {
      return {}
    },
    head() {
      return {
        changed() {
          if (store) {
            store.commit('SET_PAGE_TITLE', this.titleChunk)
          }
        }
      }
    },
    destroyed() {
      store.commit('SET_PAGE_TITLE', 'Ranked Vote')
    }
  })
}
