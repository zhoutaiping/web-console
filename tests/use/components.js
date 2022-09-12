import { createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'

const Vue = createLocalVue()
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(ElementUI)
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }

import appMixins from './appMixins'
Vue.mixin(appMixins)

export default Vue
