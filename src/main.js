import Vue from 'vue'
import App from '@/App'
import store from '@/store'
import router from '@/router'
import bootstrap from '@/core/bootstrap'
import i18n from '@/core/setup-i18n'
import VueCompositionAPI from '@vue/composition-api'
import VueClipboard from 'vue-clipboard2'
import '@/core/use'
import '@/core/use-console'
import '@/core/use-stage'
import '@/assets/core-chart'

if (process.env.NODE_ENV === 'development') {
  require('@/core/sentry')
}

Vue.use(VueClipboard)
Vue.use(VueCompositionAPI)
Vue.config.productionTip = false

// const errorHandler = (error, vm) => {
//   console.log('抛出全局异常')
//   console.log(error)
// }

// Vue.config.errorHandler = errorHandler

const KEY = 'USER_ID'
import Lockr from 'lockr'

window.addEventListener('storage', (e) => {
  if (e.key === KEY) {
    if (e.newValue !== e.oldValue) {
      Vue.prototype.$confirm('当前页面下有其他账号在不同设备、浏览器或选项卡发生了登录操作。请刷新以同步至最新登录账号，或切换其他账号登录。', '登录账号发生变更', {
        type: 'warning',
        confirmButtonText: '刷新页面',
        cancelButtonText: '登录其他账号',
        showClose: false,
        closeOnClickModal: false,
        closeOnPressEscape: false
      }).then(() => {
        // console.log(this.userInfo)
        const userType = Lockr.get('loginType')
        if (userType === 'child') {
          window.location.href = '/console/user-center'
        } else {
          location.reload()
        }
      }).catch(e => {
        const userType = Lockr.get('loginType')
        const userId = Lockr.get('userId')
        if (userType === 'child' && userId) {
          window.location.href = '/login-child/#/?member_id=' + userId
        } else {
          window.location.href = '/login'
        }
      })
    }
  }
})

new Vue({
  i18n,
  router,
  store,
  created() {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
