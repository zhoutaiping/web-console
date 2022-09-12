import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import user from './modules/user'
import domain from './modules/domain'
import select from './modules/select'
Vue.use(Vuex)

export default new Vuex.Store({
  getters,
  modules: {
    app,
    user,
    domain,
    select
  }
})
