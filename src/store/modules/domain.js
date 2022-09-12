import Fetch from '@/api/fetch'

const state = {
  id: '',
  info: {},
  infoReady: false,
  planInfo: {
    plan_name: '',
    meal_flag: '',
    expire_time: '',
    domain_packet_nums: 0,
    domain_package_unUsed: {
      pri_num: 0,
      sub_num: 0
    },
    plan_setting: {
      meal: {
        rule_number_pridomain: {},
        rule_number_subdomain: {},
        mainland_china_bandwidth: {},
        mainland_china_mainland_china_bandwidth: {},
        mainland_china_overseas_bandwidth: {},
        overseas_mainland_china_bandwidtn: {}
      }
    }
  },
  mirrorInfo: {},
  planConfig: [],
  planInfoReady: false,
  settingsLoading: true,
  settings: {
    // 回源配置
    back_source_host: {},
    slice: {},
    //  性能优化
    cdn_advance_cache: {},
    page_gzip: {},
    Webp: {},
    page_optimization: {},
    ajax_load: {},
    all_view_optimization: {},
    mobile_jump: {},
    browser_cache: {},
    // 高级配置
    search_engine_optimization: {},
    websocket: {},
    resp_headers: {},
    diy_page_500: {},
    diy_page_502_or_504: {},
    diy_page_404: {},
    // WAF
    cloud_waf: {},
    web_honeypot: {},
    waf_block_diy_page: {},
    safe_snap: {},
    source_site_protect: {},
    content_replace: {},
    anti_cc: {},
    guest_auth: {},
    ssl_acl: {}
  }
}

const mutations = {
  SET_ID(state, id) {
    state.id = id
    state.infoReady = false
  },

  SET_INFO(state, data) {
    data.ready = true // TODO
    data.hasTpl = Boolean(data.cdntpl_id)
    state.info = data
    state.infoReady = true
  },

  SET_SETTINGS(state, data) {
    delete data._status
    Object.keys(data).forEach(key => {
      state.settings[key] = data[key]
    })
    state.settingsLoading = false
  }
}

const actions = {
  async fetchInfo({ commit, state }) {
    if (!state.id) return
    const data = await Fetch.get('V4/Web.Domain.Info', { domain: state.id })
    commit('SET_INFO', data)
  },
  // 读取配置
  async fetchSettings({ commit, state }, group) {
    state.settingsLoading = true
    const params = {
      domain_id: state.id,
      group: Array.isArray(group) ? group.join(',') : group
    }
    const data = await Fetch.get('V4/web.domain.set.get', params)
    commit('SET_SETTINGS', data)
  },

  saveSettings({ state }, data) {
    const send = {
      domain_id: state.id,
      group: data
    }
    return Fetch.put('V4/web.domain.set.save', send)
  },

  async fetchPlanInfo({ state, dispatch }, update = false) {
    if (!state.planInfoReady || update) {
      const { plans = {}, mirror = {}} = await Fetch.get('V4/member.product.plan')
      state.planInfo = plans
      state.mirrorInfo = mirror
      state.planInfoReady = true
      dispatch('fetchPlanSetting', plans.meal_flag)
    }
  },

  async fetchPlanSetting({ state }, planId = 'YD-WAFMFB') {
    const { actions } = await Fetch.get('V4/member.plan.actions')
    state.planConfig = actions[planId]
  }
}

export default {
  state,
  mutations,
  actions,
  namespaced: true
}
