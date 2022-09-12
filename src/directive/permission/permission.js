import store from '@/store'

export default {
  inserted(el, binding) {
    const { value } = binding
    const { permissions = [], roles = [] } = store.getters

    if (roles.includes('root')) return
    // 子账户权限判断
    if (!permissions.includes(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}
