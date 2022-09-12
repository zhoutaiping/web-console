import Fetch from '@/api/fetch'

const state = {
  selectUser: [],
  selectStrategy: [],
  selectGroup: [],
  selectDomain: [],
  settingList: {},
  settingTabs: [],
  modulesMap: {},
  domainsMap: {}
}

const mutations = {
  SET_SELECT_USER(state, data) {
    state.selectUser = data.list.map(_ => {
      return {
        label: _.user_name,
        key: _.id
      }
    })
  },

  SET_SELECT_STRATEGY(state, data) {
    state.selectStrategy = data.list.map(_ => {
      return {
        label: _.strategy_name,
        value: _.id
      }
    })
  },

  SET_SELECT_GROUP(state, data) {
    state.selectGroup = data.list.map(_ => {
      return {
        label: _.group_name,
        value: _.id
      }
    })
  },

  SET_SELECT_DOMAIN(state, data) {
    data.list.forEach(item => {
      state.domainsMap[item.id] = item.domain
    })
    state.selectDomain = data.list.map(_ => {
      return {
        label: _.domain,
        value: _.domain,
        key: _.domain
      }
    })
  },

  SET_SETTING_LIST(state, data) {
    delete data._status
    state.settingTabs = Object.keys(data).map(key => {
      return {
        name: key,
        value: key,
        key,
        label: state.modulesMap[key]
      }
    })
    state.settingList = data
  },

  SET_MODULE_MAP(state, data) {
    // const map = {}

    data.module_tree.forEach(item => {
      state.modulesMap[item.key] = item.module_name
    })

    // state.settingTabs = data.module_tree.map(item => {
    //   state.modulesMap[item.key] = item.module_name
    //   return {
    //     value: item.key,
    //     name: item.key,
    //     label: item.module_name
    //   }
    // })
    // Object.keys(data.module_tree).forEach(key => {
    //   const item = data.module[key]
    //   Object.keys(item).forEach(cKey => {
    //     const cItem = item[cKey]
    //     map[cKey] = cItem
    //   })
    // })
  }
}

const actions = {
  async fetchUsers({ commit }) {
    const data = await Fetch.get('V4/permission.get.subUsersList', { per_page: 999 })
    commit('SET_SELECT_USER', data)
  },

  async fetchstrategy({ commit }) {
    const data = await Fetch.get('V4/permission.get.strategyList', { per_page: 999 })
    commit('SET_SELECT_STRATEGY', data)
  },

  async fetchGroup({ commit }) {
    const data = await Fetch.get('V4/permission.get.subUserGroupList', { per_page: 999 })
    commit('SET_SELECT_GROUP', data)
  },

  async fetchDomain({ commit }) {
    const data = await Fetch.get('V4/Web.Domain.list', { per_page: 999 })
    commit('SET_SELECT_DOMAIN', data)
  },

  async fetchModuleMap({ commit }) {
    const data = await Fetch.get('V4/permission.get.permissionModuleNames')
    commit('SET_MODULE_MAP', data)
  },

  async fetchSettingList({ commit, dispatch }) {
    await dispatch('fetchModuleMap')
    const data = await Fetch.get('V4/permission.get.strategySettingList')
    commit('SET_SETTING_LIST', data)
  }
}

export default {
  state,
  mutations,
  actions
}
