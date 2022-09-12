import Fetch from '@/api/fetch'

export default {
  state: {
    selectRecordLine: [],
    recordLineList: [],
    domainInfo: {},
    domainId: '',
    selects: {
      recordType: [
        {
          label: 'A',
          value: 'A'
        },
        {
          label: 'AAAA',
          value: 'AAAA'
        },
        {
          label: 'CNAME',
          value: 'CNAME'
        },
        {
          label: 'MX',
          value: 'MX'
        },
        {
          label: 'TXT',
          value: 'TXT'
        },
        {
          label: 'NS',
          value: 'NS'
        },
        {
          label: 'SRV',
          value: 'SRV'
        }
      ]
    }
  },

  mutations: {
    SET_DOMAIN_ID(state, id) {
      state.domainId = id
      state.domainInfo = {}
    },

    SET_DOMAIN_INFO(state, info) {
      state.domainInfo = info
    },

    SET_RECORD_LINE_LIST(state, list) {
      const isFree = state.domainInfo && state.domainInfo.package_id === 0
      const options = []
      const optionsView = []
      const optionsMap = {}
      const zhouList = ['亚洲', '非洲', '欧洲', '北美洲', '南美洲', '大洋洲', '南极洲']

      list.forEach(item => {
        optionsView.push({
          value: item.name,
          label: item.desc,
          id: item.id,
          parent_id: item.parent_id
        })

        if (item.parent_id === '0') {
          options.push({
            label: item.desc,
            value: item.name,
            id: item.id
          })
        } else {
          if (optionsMap[item.parent_id]) {
            optionsMap[item.parent_id].push({
              label: item.desc,
              value: item.name,
              id: item.id
            })
          } else {
            optionsMap[item.parent_id] = [{
              label: item.desc,
              value: item.name,
              id: item.id
            }]
          }
        }
      })

      options.forEach(item => {
        if (optionsMap[item.id]) {
          const children = optionsMap[item.id]
          children.forEach(cItem => {
            if (optionsMap[cItem.id]) {
              const children = optionsMap[cItem.id]
              // 免费版不允许选洲
              const disabled = isFree && zhouList.includes(cItem.label)
              children.forEach(ccItem => {
                ccItem.disabled = disabled
                if (optionsMap[ccItem.id]) {
                  ccItem.children = optionsMap[ccItem.id]
                }
              })
              cItem.children = children
            }
          })
          item.children = children
        }
      })

      state.selectRecordLine = options
      state.recordLineList = optionsView
    }
  },

  actions: {
    async fetchDomainInfo({ commit, state, dispatch }) {
      const params = { domain_id: state.domainId }
      const data = await Fetch.get('V4/CloudDns.Domain.DnsDomain.info', params)
      commit('SET_DOMAIN_INFO', data)
      dispatch('fetchRecordLine')
    },

    async fetchRecordLine({ commit }) {
      const data = await Fetch.get('V4/CloudDns.Member.Line.getMemberLines')
      commit('SET_RECORD_LINE_LIST', data)
    }
  },

  namespaced: true
}
