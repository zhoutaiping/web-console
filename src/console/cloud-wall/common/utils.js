import { selectExclude } from '@/utils/form'

// 策略类型检查
export function checkFormRule(scope) {
  const { formRules, MATCHING_TCP_TYPE, MATCHING_TCP_TYPE_VAR } = scope
  if (formRules.length <= 1) {
    selectExclude(MATCHING_TCP_TYPE, [])
    return
  }

  const exclude = formRules.map(item => item.type)
  // IP 和 区域只能选一
  if (exclude.includes(MATCHING_TCP_TYPE_VAR.IP)) {
    exclude.push(MATCHING_TCP_TYPE_VAR.Region)
  } else if (exclude.includes(MATCHING_TCP_TYPE_VAR.Region)) {
    exclude.push(MATCHING_TCP_TYPE_VAR.IP)
  }
  selectExclude(MATCHING_TCP_TYPE, exclude)
}
