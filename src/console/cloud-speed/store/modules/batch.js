import Fetch from '@/api/fetch'

const state = {
  selectType: 'custom', // 选择类型
  selectsId: [],
  selectsList: [],
  groupId: '',
  haveWAF: false,
  haveCheck: false,
  listPort: [],
  selectListenPort: []
}

const mutations = {
  SET_GROUP_ID(state, data) {
    state.groupId = data
  },
  SET_SELECT_TYPE(state, type) {
    state.selectType = type
  },
  SET_DOMAIN_SELECTS_ID(state, data) {
    state.selectsId = data
  },
  SET_DOMAIN_SELECTS_LIST(state, data) {
    state.selectsList = data
  },
  SET_HAVE_WAF(state, data) {
    state.haveWAF = data
  },
  SET_HAVE_CHECK(state, data) {
    state.haveCheck = data
  },
  SET_LIST_PORT(state, data) {
    const list = Object.values(data)
    state.listPort = list.map(_ => {
      return {
        label: _,
        value: _
      }
    })
  }
}

const actions = {
  async fetchBatchListen({ commit, state }) {
    const parmas = {}
    if (state.selectType === 'custom') {
      parmas.domain_ids = state.selectsId
    } else {
      parmas.group_id = state.groupId
    }

    const data = await Fetch.post('V4/web.domain.batch.get.listen', parmas)
    delete data._status
    state.selectListenPort = data.map(_ => {
      return {
        value: _,
        label: _
      }
    })
  },

  async domainListInfo({ commit, state }) {
    if (state.selectType === 'custom') {
      if (state.selectsId && state.selectsId.length) {
        const data = await Fetch.post('V4/Web.Domain.batch.domain.info', { domain_ids: state.selectsId })
        const { domains, ports } = data

        commit('SET_HAVE_WAF', domains.some(_ => _.cfw_migrate === '2'))
        commit('SET_HAVE_CHECK', domains.some(_ => _.check_status === '1'))
        commit('SET_LIST_PORT', ports)
      }
    } else {
      const data = await Fetch.post('V4/web.domain.group.domain.list', { group_id: state.groupId })
      const { ports } = data
      commit('SET_LIST_PORT', ports)
    }
  }
}

export default {
  state,
  mutations,
  actions
}
