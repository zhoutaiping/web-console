import locale from '../locale/cht'
import element from 'element-ui/lib/locale/lang/zh-TW'
import installModules from '@/core/setup-modules-i18n'

export default {
  ...locale.default,
  ...element,
  ...installModules('cht')
}
