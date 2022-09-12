import Fetch from '@/api/fetch'

function formatTree(list) {
  return list.map(item => {
    item.label = item.name
    if (item.subGroups && item.subGroups.length) {
      item.children = formatTree(item.subGroups)
    }
    return item
  })
}

// https://wintc.top/article/20
export function treeFindPath(tree, func, path = []) {
  if (!tree) return []
  for (const data of tree) {
    path.push(data.id)
    if (func(data)) return path
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, path)
      if (findChildren.length) return findChildren
    }
    path.pop()
  }
  return []
}

export function formatFullValues(values, list) {
  return values.map(value => treeFindPath(list, node => node.id === value))
}

export async function fetchTree() {
  let data = []

  try {
    data = await Fetch.post('V4/zero.trust.yunad.organization.all')
  } catch (e) {
    //
  }

  delete data._status

  let list = [
    {
      label: '我的组织',
      id: 'root'
    }
  ]

  let defaultValue = 'root'
  if (data && data.length) {
    list = formatTree(data)
    defaultValue = data[0].id
  }

  return {
    list,
    defaultValue
  }
}
