import router from '@/console/security-operations/router'
import config from '@/console/security-operations/config'
import zh from '@/console/security-operations/locale/zh'
import en from '@/console/security-operations/locale/en'

export default {
  router,
  config,
  locale: {
    zh: zh.default,
    en: en.default
  }
}
