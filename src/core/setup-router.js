export function installRouter(config) {
  const { modules, consoleUrl, consoleHome } = config
  const children = []

  for (const name of modules) {
    const { router } = require(`@/config/modules/${name}`).default
    const items = router.children
    if (items && items.length) {
      router.redirect = {
        name: items[0].name
      }
    }
    children.push(router)
  }

  const data = {
    path: consoleUrl,
    component: () => import('layout/ConsoleLayout'),
    meta: { breadcrumb: false },
    redirect: consoleHome,
    children
  }

  return data
}

export function loadModuleList(config) {
  const { modules } = config
  const list = []

  for (const name of modules) {
    const { config } = require(`@/config/modules/${name}`).default
    list.push({
      id: config.id,
      name: config.name,
      icon: config.icon,
      baseUrl: config.baseUrl
    })
  }
  return list
}

export function installSidebar(config) {
  const sidebarConfig = config.sidebar
  const sidebar = []
  sidebarConfig.forEach(item => {
    if (typeof item === 'string') {
      sidebar.push(exportItem(item))
    } else {
      const { modules = [] } = item
      const items = []
      if (modules.length) {
        modules.forEach(name => {
          items.push(exportItem(name))
        })
      }
      sidebar.push({
        title: item.title,
        name: item.name,
        access: item.access,
        groupId: item.groupId,
        items,
        icon: item.icon,
        children: item.children
      })
    }
  })
  return sidebar
}

function exportItem(name) {
  const { config } = require(`@/config/modules/${name}`).default
  return {
    url: `/console/${config.id}`,
    icon: config.icon,
    title: config.title,
    name: config.name,
    access: config.access
  }
}
