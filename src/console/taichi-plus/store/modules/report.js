import Tjkd from '@/api/tjkd'
import Fetch from '@/api/fetch'

const state = {
  listPackage: [],
  selectIp: [],
  selectPort: [],
  selectDomain: [],
  packageId: '',
  utime: '',
  haveInterval: true,
  intervalFn: null,
  interval: 60
}

const mutations = {
  SET_INTERVAL(state, value) {
    state.interval = value
  },
  SET_INTERVAL_FN(state, number) {
    state.intervalFn = number
  },
  SET_INTERVAL_SHOW(state, op) {
    state.haveInterval = op
  },
  SET_UTIME(state) {
    state.utime = Date.now()
  },
  SET_PACKAGE_ID(state, data) {
    state.packageId = data
  },
  SET_PACKAGE_LIST(state, data) {
    state.listPackage = data
  },
  SET_SELECT_IP(state, data) {
    state.selectIp = data.map(_ => {
      return {
        label: _.ip_string,
        value: _.ip_string
      }
    })
  },
  SET_SELECT_DOMAIN(state, data) {
    state.selectDomain = data.map(_ => {
      return {
        label: _.domain,
        value: _.domain
      }
    })
  },
  SET_SELECT_PORT(state, data) {
    state.selectPort = data.map(_ => {
      return {
        label: _,
        value: _
      }
    })
  }
}

const actions = {
  hideInterval({ dispatch, commit }) {
    commit('SET_INTERVAL_SHOW', false)
    dispatch('stopInterval')
  },

  showInterval({ dispatch, commit, state }) {
    commit('SET_INTERVAL_SHOW', true)
    dispatch('startInterval', state.interval)
  },

  updateInterval({ dispatch, commit }, value) {
    commit('SET_INTERVAL', value)
    dispatch('startInterval', value)
  },

  stopInterval({ state }) {
    clearInterval(state.intervalFn)
  },

  startInterval({ dispatch, state, commit }) {
    dispatch('stopInterval')
    const value = state.interval
    const fn = setInterval(() => {
      commit('SET_UTIME')
    }, value * 1000)
    commit('SET_INTERVAL_FN', fn)
  },

  // 套餐详情
  async getPackageDetail({ dispatch, state }) {
    const params = {
      package_id: state.packageId
    }
    dispatch('getPackagePort', params)
    dispatch('getPackageIp', params)
    dispatch('getPackageDomain', params)
  },

  async getPackagePort({ commit }, params) {
    const data = await Fetch.get('V4/tjkd.plus.package.port.list', params)
    // const { list = [] } = data
    commit('SET_SELECT_PORT', data)
  },

  async getPackageIp({ commit }, params) {
    const data = await Fetch.get('V4/Tjkd.plus.package.ip.list', params)
    const { list = [] } = data
    commit('SET_SELECT_IP', list)
  },

  async getPackageDomain({ commit }, params) {
    const data = await Fetch.get('V4/Tjkd.plus.package.domain.list', params)
    const { list = [] } = data
    commit('SET_SELECT_DOMAIN', list)
  },
  // 套餐列表
  async getPackagePlusList({ commit, state, dispatch }) {
    const data = await Tjkd.plusPackageAll()
    const { list = [] } = data
    commit('SET_PACKAGE_LIST', list)
    if (list.length > 0) commit('SET_PACKAGE_ID', list[0].value)
  },
  // 切换套餐
  changePackage({ commit, dispatch }, value) {
    commit('SET_PACKAGE_ID', value)
    dispatch('getPackageDetail')
  }
}

export default {
  state,
  mutations,
  actions
}
