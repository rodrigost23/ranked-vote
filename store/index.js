export const state = function() {
  return { pageTitle: 'Ranked Vote' }
}

export const mutations = {
  SET_PAGE_TITLE(state, title) {
    state.pageTitle = title
  }
}
