import Fetch from '@/api/ads'
import FetchV4 from '@/api/fetch'
import Message from '@/utils/message'
import AREA_MAP from '@/constants/ads-area'
import { deepClone } from '@/utils'
import Selects from '../constants/selects'

function formatGetArea(data = []) {
  const MAP = {}
  Object.keys(AREA_MAP).forEach(key => {
    MAP[AREA_MAP[key]] = key
  })

  const output = {
    province: [],
    country: data.map(_ => MAP[_])
  }

  return output
}

function formatSendArea(data) {
  const { country = [] } = data
  return country.map(_ => AREA_MAP[_])
}

const state = {
  selects: Selects,
  selectCluster: [],
  selectTemplate: [],
  selectReceiver: [],
  selectDefense: [],
  selectDefenseIp: {},
  settings: {
    botipFilterSwitch: false,
    dropTcpAllSwitch: false,
    tcpBpsLimitSwitch: false,
    tcpBpsLimit: 0,
    srcPpsLimitSwitch: false,
    srcPpsLimit: 0,
    tcpAbnormalSwitch: false,
    tcpFlagInvalidProtectSwitch: false,
    dropNoMssAllSwitch: false,
    synProtectionSwitch: true, // TODO
    synPpsThreshold: 0,
    synProtectionAlg: 0,
    synPpsLimit: 0,
    srcSynPpsLimit: 0,
    srcSynAutoForbidSwitch: false,
    srcSynPpsMax: 0,
    srcSynStatsTime: 0,
    synAckProtectionSwitch: true, // TODO
    synAckPpsThreshold: 0,
    ackProtectionSwitch: false,
    ackPpsThreshold: 0,
    ackProtectionAlg: 0,
    finRstProtectionSwitch: false,
    finRstPpsThreshold: 0,
    tcpFragmentSwitch: false,
    tcpFragmentPpsThreshold: 0,
    tcpFragmentPpsLimit: 0,
    tcpConnectProtectionSwitch: false,
    tcpConnectThreshold: 0,
    srcTcpConnectLimit: 0,
    dstTcpConnectLimit: 0,
    dropUdpAllSwitch: false,
    udpProtectionSwitch: false,
    udpBpsThreshold: 0,
    udpBpsLimit: 0,
    udpFragmentSwitch: false,
    udpFragmentPpsThreshold: 0,
    udpFragmentPpsLimit: 0,
    dropIcmpAllSwitch: false,
    icmpProtectionSwitch: false,
    icmpPpsThreshold: 0,
    icmpPpsLimit: 0,
    dropOtherAllSwitch: false,
    otherProtectionSwitch: false,
    otherBpsThreshold: 0,
    otherBpsLimit: 0,
    dynamicBlackWhiteListSwitch: true,
    srcTrustTimeout: 0,
    defenseGroupId: '',
    srcConnectAutoForbidSwitch: false,
    synAckPpsLimit: 0,
    tcpConnectPpsThreshold: 0,
    srcTcpConnectPpsLimit: 0,
    dstTcpConnectPpsLimit: 0,
    srcConnectPpsAutoForbidSwitch: false,
    srcConnectPpsStatsTime: 0,
    srcConnectPpsMax: 0,
    srcStationAutoLearnSwitch: false,
    synAckPortFilterSwitch: false,
    synAckPortStart: 0,
    synAckPortEnd: 0,
    synAckEnhanceProtectionSwitch: false,
    synAckEnhancePpsThreshold: 0,
    geoIpFilterSwitch: false,
    // geoIpCountryId: [],
    geoIpCountryIdPrimary: [],
    dnsProtectionSwitch: false,
    dnsPpsLimitSwitch: false,
    srcDnsQueryAutoForbidSwitch: false,
    dnsQueryPpsThreshold: 0,
    dnsQueryProtectionAlg: 0,
    dnsPpsLimit: 0,
    srcDnsQueryPpsLimit: 0,
    srcDnsQueryPpsMax: 0,
    srcDnsQueryStatsTime: 0,
    icmpEnhanceProtectionSwitch: false,
    srcIcmpPpsMin: 0,
    srcIcmpStatsTime: 0,
    uuid: '',
    ruleList: [],
    ruleUidList: ''
  }
}

const mutations = {
  SET_SELECT_CLUSTER(state, data) {
    state.selectCluster = data
  },

  SET_SELECT_DEFENCE(state, data) {
    state.selectDefense = data
  },

  SET_SELECT_TEMPLATE(state, data) {
    state.selectTemplate = data
  },

  SET_SELECT_RECEIVER(state, data) {
    state.selectReceiver = data
  },

  SET_SETTINGS(state, data) {
    Object.keys(data).forEach(key => {
      if (key === 'geoIpCountryIdPrimary') {
        state.settings[key] = formatGetArea(data[key])
      } else {
        state.settings[key] = data[key]
      }
    })
  }
}

const getters = {
  // 公开模板
  selectTemplatePublic: state => {
    return state.selectTemplate.filter(_ => _.isPublic)
  },
  // 返回公开模板列表并添加当前编辑的私有模板ID（用于编辑）
  selectTemplatePublicWithId: state => id => {
    const selectTemplatePublicWithId = state.selectTemplate.filter(_ => _.isPublic)
    selectTemplatePublicWithId.push({
      label: '复制上级模板',
      value: 'extendsParent'
    })
    return selectTemplatePublicWithId
  }
}

const actions = {
  async fetchClusterList({ commit }) {
    const { list = [] } = await Fetch.post('admin/cluster/query', { page: 1, size: 1000 })
    commit('SET_SELECT_CLUSTER', list.map(_ => {
      return {
        label: _.name,
        value: _.uuid
      }
    }))
  },

  async fetchDefenseList({ commit, state }) {
    const list = await Fetch.get('admin/defense/getAllDefense')
    delete list._status
    commit('SET_SELECT_DEFENCE', list.map(_ => {
      return {
        label: _.name,
        value: _.uuid
      }
    }))
  },

  async fetchTemplateList({ commit }) {
    const { list = [] } = await Fetch.post('admin/template/query', { page: 1, size: 1000 })
    commit('SET_SELECT_TEMPLATE', list.map(_ => {
      return {
        label: _.name,
        value: _.uuid,
        isPublic: _.isPublic
      }
    }))
  },

  async fetchReceiverList({ commit }) {
    const { receivers_list = [] } = await FetchV4.get('V4/cloud.monitor.alertSetting.config')
    commit('SET_SELECT_RECEIVER', receivers_list.map(_ => {
      return {
        label: _.name,
        value: _.value
      }
    }))
  },

  async fetchSettings({ commit }, uuid) {
    const data = await Fetch.get('admin/template/queryById', { uuid, widthRule: true })
    commit('SET_SETTINGS', {
      ...data,
      uuid
    })
  },

  async fetchSaveSettings({ dispatch, state } = {}, params) {
    const settings = deepClone(state.settings)
    const { vm = null } = params
    const form = {
      ...settings,
      synProtectionSwitch: true,
      synAckProtectionSwitch: true,
      geoIpCountryIdPrimary: formatSendArea(settings.geoIpCountryIdPrimary)
    }
    let data
    try {
      data = await Fetch.post('admin/template/setConfig', form)
      if (vm) {
        const { query = {}} = vm.$route
        vm.$router.push({
          name: 'anti-ddos.router.settings__id',
          params: { id: data.uuid },
          query: { ...query }
        })
      }
    } catch (e) {
      return
    } finally {
      dispatch('fetchSettings', data.uuid)
    }

    Message('ACTION_SUCCESS')
  }
}

export default {
  state,
  getters,
  mutations,
  actions,
  namespaced: true
}
