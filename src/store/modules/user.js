import Fetch from '@/api/fetch'
import { getUserstore, rmUserstore, setUserStore } from '@/utils/auth'
import Vue from 'vue'

const state = {
  info: {
    bindEmail: 0,
    bindMobile: 0,
    bindWechat: 0,
    userType: '',
    created_at: '',
    user_name: '',
    p_name: '',
    member_id: ''
  },
  userId: '',
  isLogin: false
}

const mutations = {
  SET_INFO(state, data) {
    state.info = data

    state.info.bindEmail = data.bindEmail
    state.info.bindMobile = data.bindMobile
    state.info.created_at = data.created_at || data.addtime || ''
    if (data.weiXin && data.weiXin.length > 0) {
      state.info.bindWechat = 1
      state.info.wechat = data.weiXin.nickname
    } else {
      state.info.bindWechat = 0
      state.info.wechat = ''
    }
    const { userType } = getUserstore()
    state.info.user_name = userType === 'child' ? data.user_name && data.user_name || '' : ''
    state.info.p_name = userType === 'child' ? data.member_info && data.member_info.username || '' : ''
    state.info.member_id = userType === 'child' ? data.id && data.member_info.member_id || '' : ''
    state.isLogin = true
    state.userId = data.id
  },

  SET_IS_LOGIN(state, data) {
    state.isLogin = data
  }
}

const actions = {
  async getUserinfo({ commit }) {
    const { userType } = getUserstore()
    let data
    if (userType === 'child') {
      data = await Fetch.get('V4/permission.get.subUserInfo')
    } else {
      data = await Fetch.get('sso/V4/getUserInfo')
    }
    data.userType = userType
    if (data.http_status_code === 204) return
    commit('SET_INFO', data)
    setUserStore(data)
    commit('SET_IS_LOGIN', true)
  },

  async loginOut({ commit, state }) {
    const { userType } = getUserstore()

    if (userType === 'child') {
      await Fetch.get('sso/V4/subuser/logout')
    } else {
      await Fetch.get('sso/V4/logOut')
    }
    rmUserstore()
    if (userType === 'child') {
      const member_id = state.info && state.info.member_id || ''
      window.location.href = member_id ? '/login-child/#/?member_id=' + member_id : '/login'
    } else {
      window.location.href = '/login'
    }
    commit('SET_INFO', {})
    commit('SET_IS_LOGIN', false)
    Vue.ls.remove('serviceAlert')
  }
}
export default {
  state,
  mutations,
  actions
}
