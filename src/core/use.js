import Vue from 'vue'
import VueStorage from 'vue-ls'
import Config from '@/core/setup-config'
import './echarts'
import permission from '@/directive/permission/permission'
// mixins
import appMixins from '@/mixins/app'
import userMixins from '@/mixins/user'

import VueCropper from 'vue-cropper'
Vue.use(VueCropper)
// import './pwa'

Vue.directive('permission', permission)
Vue.mixin(appMixins)
Vue.mixin(userMixins)

// tool
import Fetch from '@/api/fetch'
import Api from '@/api/api'
import Ads from '@/api/ads'
import Message from '@/utils/message'
import { installFilter } from '@/utils/filter'

installFilter(Vue)

Vue.use(VueStorage, Config.storageOptions)

Vue.prototype.Fetch = Fetch
Vue.prototype.$Api = Api
Vue.prototype.$Ads = Ads
Vue.prototype.Message = Message

// style
import 'normalize.css/normalize.css'
import '@/styles/index.scss'

// ui
import Layout from 'layout'
import './components'
Vue.use(Layout)
import ElementUI from 'element-ui'
Vue.use(ElementUI)
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }

import Dm from '@/components/Dm'
Vue.use(Dm)

import DatePicker from 'ant-design-vue/lib/date-picker'
import 'ant-design-vue/lib/date-picker/style'

Vue.use(DatePicker)
