import * as CLOUD_WALL from '@/constants/cloud-wall'
import Wall from '@/api/firewall'
import { selectExclude, selectLabelFormat } from '@/utils/form'
import { deepClone } from '@/utils'
import Fetch from '@/api/fetch'

const wall = {
  state: {
    selectIpList: [],
    CLOUD_WALL,
    MATCHING_ALL_TYPE: [],
    MATCHING_TYPE: [],
    MATCHING_TYPE_VAR: {},
    MATCHING_LOGIC: {},
    SELECT_DATA: {},
    LOGIC_LABEL: {},

    MATCHING_TCP_TYPE: [],
    MATCHING_TCP_TYPE_VAR: {},
    MATCHING_TCP_LOGIC: {},
    SELECT_TCP_DATA: {},

    router: {
      tcp: true
    }
  },

  getters: {
    MATCHING_TCP_TYPE_SHOW: state => exclude => {
      const MATCHING_TCP_TYPE = deepClone(state.MATCHING_TCP_TYPE)
      return selectExclude(MATCHING_TCP_TYPE, exclude)
    }
  },

  mutations: {
    async fetchIpList(state) {
      const res = await Fetch.get('V4/user.ip.list', { page: 1, per_page: 999, is_item: 1 })
      const { list = [] } = res
      state.selectIpList = list.map(_ => {
        return {
          label: _.name,
          value: _.file_key
        }
      })
    },

    SET_CONFIG: (state, data) => {
      const { logic: LOGIC_LABEL, rules } = data

      const MATCHING_LOGIC = {}
      const SELECT_DATA = {}
      const [MATCHING_TYPE, MATCHING_TYPE_VAR] = selectLabelFormat(rules, 'name', 'cfg')

      // 转标准格式
      for (const k in rules) {
        const item = rules[k]
        const { logic, data } = item

        // 规则相应逻辑
        const child = []
        logic.forEach(value => {
          if (LOGIC_LABEL[value]) {
            const label = LOGIC_LABEL[value].name
            child.push({
              label,
              value
            })
          }
        })

        if (k === 'upstream_status') {
          const HTTP_CODES = selectLabelFormat(data.statuses)[0]
          HTTP_CODES.forEach(item => (item.value = item.value.toString()))
          SELECT_DATA.HTTP_CODES = HTTP_CODES
        } else if (k === 'req_method') {
          SELECT_DATA.REQ_METHOD = selectLabelFormat(data.methods)[0]
        } else if (k === 'req_header') {
          SELECT_DATA.REQ_HEADER = selectLabelFormat(data.headers)[0]
        } else if (k === 'postfix') {
          // SELECT_DATA.POSTFIX = data
        } else if (k === 'ip_type') {
          SELECT_DATA.IP_TYPE = selectLabelFormat(data.types)[0]
        } else if (k === 'device_type') {
          SELECT_DATA.DEVICE_TYPE = selectLabelFormat(data.types)[0]
        }
        MATCHING_LOGIC[k] = child
      }

      state.MATCHING_TYPE = MATCHING_TYPE
      state.MATCHING_TYPE_VAR = MATCHING_TYPE_VAR
      state.MATCHING_LOGIC = MATCHING_LOGIC
      state.SELECT_DATA = SELECT_DATA
      state.LOGIC_LABEL = LOGIC_LABEL

      state.MATCHING_ALL_TYPE = state.MATCHING_TYPE.concat(state.MATCHING_TCP_TYPE)
    },
    SET_TCP_CONFIG: (state, data) => {
      const { LOGIC_LABEL } = state
      const { rules } = data

      const MATCHING_TCP_LOGIC = {}
      const SELECT_TCP_DATA = {}
      const [MATCHING_TCP_TYPE, MATCHING_TCP_TYPE_VAR] = selectLabelFormat(rules, 'name', 'cfg')

      // 转标准格式
      for (const k in rules) {
        const item = rules[k]
        const { logic, data } = item

        // 规则相应逻辑
        const child = []
        logic.forEach(value => {
          if (LOGIC_LABEL[value]) {
            const label = LOGIC_LABEL[value].name
            child.push({
              label,
              value
            })
          }
        })
        MATCHING_TCP_LOGIC[k] = child

        if (k === 'tcp_ip_type') {
          SELECT_TCP_DATA.IP_TYPE = selectLabelFormat(data.types)[0]
        }
      }

      state.MATCHING_TCP_TYPE = MATCHING_TCP_TYPE
      state.MATCHING_TCP_TYPE_VAR = MATCHING_TCP_TYPE_VAR
      state.MATCHING_TCP_LOGIC = MATCHING_TCP_LOGIC
      state.SELECT_TCP_DATA = SELECT_TCP_DATA

      state.MATCHING_ALL_TYPE = state.MATCHING_TYPE.concat(state.MATCHING_TCP_TYPE)
    }
  },

  actions: {
    async getWallConfig({ commit }) {
      const data = await Wall.firewallPagecfg('plus')
      if (data) commit('SET_CONFIG', data)

      const dataTCP = await Wall.firewallPagecfg('tcp')

      if (dataTCP) commit('SET_TCP_CONFIG', dataTCP)
    }
  }
}

export default wall
