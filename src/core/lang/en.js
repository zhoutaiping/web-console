import locale from '../locale/en'
import element from 'element-ui/lib/locale/lang/en'
import installModules from '@/core/setup-modules-i18n'

export default {
  ...locale.default,
  ...element,
  ...installModules('en')
}
