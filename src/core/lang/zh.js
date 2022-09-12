import locale from '../locale/zh'
import element from 'element-ui/lib/locale/lang/zh-CN'
import installModules from '@/core/setup-modules-i18n'

export default {
  ...locale.default,
  ...element,
  ...installModules('zh')
}
