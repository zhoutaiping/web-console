const state = {
  utime: '',
  params: {}
}

const mutations = {
  SET_UTIME(state) {
    state.utime = Date.now()
  },

  SET_PARAMS(state, data) {
    state.params = data
  }
}

const actions = {}

export default {
  state,
  mutations,
  actions
}
