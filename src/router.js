import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'
import Config from '@/core/setup-config'
// import corePwa from '@/core/pwa/main'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

router.beforeEach((to, from, next) => {
  const { name: toName } = to
  const { name: fromName } = from
  if (router.app.$store) {
    const { name } = router.app.$store.state.app.pagination
    if (fromName && name && !fromName.includes(toName) && !toName.includes(fromName) && !fromName.includes(name) && !fromName.includes(name)) {
      router.app.$store.commit('CLEAR_PAGINATION')
    }
    // TODO
    const [moduleName] = toName.split('.')
    if (moduleName === 'user-center') {
      router.app.$store.commit('SET_SIDEBAR_GROUP_ID', 'user')
    }
  }
  document.title = `控制台 | ${Config.assets.titleSuffix}`

  next()
})

// corePwa(router)

export default router
