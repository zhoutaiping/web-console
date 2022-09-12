import router from '@/console/cloud-speed/router'
import config from '@/console/cloud-speed/config'
import zh from '@/console/cloud-speed/locale/zh'
import en from '@/console/cloud-speed/locale/en'

export default {
  router,
  config,
  locale: {
    zh: zh.default,
    en: en.default,
  }
}
