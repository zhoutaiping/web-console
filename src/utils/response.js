import { deepClone } from './'

export function formatList(res) {
  const data = res
  if (data) {
    const { list = [] } = data
    const total = data.total || data.count || 0
    return { list, total: Number(total) }
  } else {
    return { list: [], total: 0 }
  }
}

export function mergeParams(params, ...more) {
  params = deepClone(params)
  more.forEach(item => {
    Object.assign(params, item)
  })
  return params
}
