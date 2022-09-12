import Fetch from '@/api/fetch'

const select = {
  state: {
    selectWallDomains: [],
    region: [],
    regionMap: {},
    wallDomainsIdMap: {}
  },

  mutations: {
    SET_SELECT_WALL_DOMAINS: (state, data) => {
      state.selectWallDomains = data.list.map(_ => {
        state.wallDomainsIdMap[_.domain] = _.domain_id
        return {
          label: _.domain,
          value: _.domain
        }
      })
    },

    SET_SELECT_REGION: (state, data) => {
      state.region = data
    },

    SET_SELECT_REGION_MAP: (state, data) => {
      state.regionMap = data
    }
  },

  actions: {
    async fetchWallDomains({ commit }) {
      const data = await Fetch.get('V4/cloudsafe.hwws.domain.list', { per_page: 10000 })
      commit('SET_SELECT_WALL_DOMAINS', data)
    }
  }
}

export default select
