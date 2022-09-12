import Config from '@/core/setup-config'
import { installRouter } from '@/core/setup-router'
import { installSidebar } from '@/core/setup-router'

export const constantRouterMap = [
  installRouter(Config),
  {
    path: '*',
    redirect: Config.consoleHome,
  }
]

export const sidebarMap = installSidebar(Config)