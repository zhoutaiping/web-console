import Fetch from '@/api/fetch'

const state = {
  loadingPackage: true,
  selectPackage: [],
  selectPort: [],
  selectIP: [],
  selectDomain: [],
  params: {
    package_id: ''
  },
  utime: 0,
  info: {}
}

const mutations = {
  SET_PACKAGE_LIST: (state, list) => {
    state.selectPackage = list
  },

  SET_SELECT_PORT: (state, list) => {
    state.selectPort = list.map(_ => {
      return {
        value: _,
        label: _
      }
    })
  },

  SET_SELECT_IP: (state, list) => {
    state.selectIP = list.map(_ => {
      return {
        label: _.ip_string,
        value: _.ip_string
      }
    })
  },

  CHANGE_PARAMS: (state, data) => {
    state.params = data
    state.utime = Date.now()
    state.loadingPackage = false
  }
}

const actions = {
  async fetchPackageList({ commit }) {
    const { list = [] } = await Fetch.get('V4/Tjkd.plus.package.all')
    if (list.length) {
      commit('SET_PACKAGE_LIST', list)
      return list
    }
  },

  async fetchPackagePort({ commit }, package_id) {
    const data = await Fetch.get('V4/tjkd.plus.package.port.list', { package_id })
    if (data.length) {
      commit('SET_SELECT_PORT', data)
    }
  },

  async fetchPackageIP({ commit }, package_id) {
    const data = await Fetch.get('V4/Tjkd.plus.package.ip.list', { package_id })
    const { list = [] } = data
    if (list.length) {
      commit('SET_SELECT_IP', list)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
