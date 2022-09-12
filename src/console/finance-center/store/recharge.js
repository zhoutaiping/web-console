import * as types from '../constants/MutationTypes'
import SourceFinanceResource from '../resource/SourceFinanceResource'
import Fetch from '@/api/fetch'
// import { MessageBox } from 'element-ui'

const state = {
  list: [],
  total: 0,
  balance: 0
}

const actions = {
  async getRechargeByPage({ commit, state }, params) {
    // params.platform = 2
    // BAISHAN
    const data = await Fetch.get('/V4/finance.recharge.rechargeList', params)
    const { list, total } = data
    commit(types.RECEIVE_RECHARGE_BY_PAGE, {
      list
    })
    commit(types.RECEIVE_RECHARGE_TOTAL, {
      total
    })
  },
  launchRecharge(
    { dispatch, commit, state },
    { pageName, orderCode, couponCode, pageSize, total_fee, tempWindow, vm, company }
  ) {
    SourceFinanceResource.launchRecharge({
      total_fee,
      company
    }).then(response => {
      tempWindow.location = response.data.data.alipay_form_params.request_url
      commit(types.PAY_CONFIG_VISIBLE, { visible: false })
      vm.$refs.rechargeForm.resetFields()
      vm.$confirm('确认已完成充值?', '提示', {
        type: 'warning',
        confirmButtonText: '已完成',
        cancelButtonText: '未完成'
      })
        .then(() => {
          location.reload()
        })
        .catch(() => {
          location.reload()
        })
    })
  },

  async getUserBalance({ commit, state }) {
    // BAISHAN
    if (this.appEnv === 'baishan') {
      const data = await Fetch.get('/V4/finance.recharge.baishan.balance')
      const { balance } = data
      commit(types.RECEIVE_BALANCE, { balance })
    } else {
      SourceFinanceResource.getUserBalance().then(response => {
        const balance = response.data.data.balance
        commit(types.RECEIVE_BALANCE, { balance })
      })
    }
  }
}

const mutations = {
  [types.RECEIVE_RECHARGE_BY_PAGE](state, { list }) {
    state.list = list
  },
  [types.RECEIVE_RECHARGE_TOTAL](state, { total }) {
    state.total = parseInt(total, 10)
  },
  [types.RECEIVE_BALANCE](state, { balance }) {
    state.balance = balance
  }
}

export default {
  state,
  actions,
  mutations
}
