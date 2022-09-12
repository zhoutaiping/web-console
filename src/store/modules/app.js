import Vue from 'vue'
import Fetch from '@/api/fetch'
import Config from '@/core/setup-config'
import { sidebarMap } from '@/config/router.config'
import { loadLanguageAsync } from '@/core/setup-i18n'
import { loadModuleList } from '@/core/setup-router'
import { getUserstore } from '@/utils/auth'
import { installModulesSettings } from '@/core/setup-modules'
import Axios from 'axios'

const app = {
  state: {
    name: Config.name,
    assets: Config.assets,
    pageData: {},
    language: '',
    // layout
    collapse: false,
    sidebar: [],
    sidebarGroupId: '',
    sidebarGroups: Config.sidebarGroups,
    defaultOpeneds: [],
    // module
    layoutReady: false,
    moduleList: loadModuleList(Config),
    moduleSettings: installModulesSettings(),
    moduleId: '',
    permissions: [],
    roles: [],
    moduleAccess: {},
    moduleReady: false,
    moduleConfig: {},
    moduleMenus: {},
    moduleLabel: {
      'cloud-speed': null
    },
    ready: false,
    pagination: false
  },

  getters: {
    sidebarView: state => {
      if (state.sidebarGroupId) {
        return state.sidebar.filter(_ => _.groupId === state.sidebarGroupId)
      } else {
        return state.sidebar
      }
    }
  },

  mutations: {
    SET_APP_READY(state, data) {
      state.ready = true
    },

    UPDATE_PAGE_BACK(state, data) {
      state.pageBack = data
    },

    SET_PAGE_DATA(state, data) {
      state.pageData = data
    },

    SET_MODULE: (state, data) => {
      const { config } = data
      state.moduleId = config.id
      state.moduleConfig = config
      state.moduleMenus = []

      if (data.menus) {
        let menus = data.menus.filter(_ => !_.hidden)
        if (config.settings && config.settings.menus && config.settings.menus.length) {
          const menusShow = config.settings.menus
          menus = menus.filter(_ => menusShow.includes(_.name))
        }

        state.moduleMenus = menus
      }
      state.moduleReady = true
    },

    SET_LANGUAGE: (state, data) => {
      Vue.ls.set('language', data)
      loadLanguageAsync(data)
      state.language = data
    },

    TOGGLE_SIDEBAR: state => {
      const op = !state.collapse
      state.collapse = op
    },

    SET_APP_INFO: (state, info) => {
      state.info = info
    },
    // 侧边栏
    SET_SIDEBAR: (state, { sidebar, defaultOpeneds }) => {
      state.sidebar = sidebar
      state.defaultOpeneds = defaultOpeneds
      state.layoutReady = true
    },

    SET_SIDEBAR_GROUP_ID: (state, id) => {
      state.sidebarGroupId = id
    },

    SET_MODULE_LABEL: (state, { name, data }) => {
      state.moduleLabel[name] = data
    },

    SET_PAGINATION: (state, data) => {
      state.pagination = data
    },

    CLEAR_PAGINATION: (state, data) => {
      state.pagination = false
    }
  },
  actions: {
    async initApp({ commit }) {
      const res = await Fetch.get('/')
      commit('SET_APP_INFO', res)
    },

    async initModule({ commit }, data) {
      commit('SET_MODULE', data)
    },

    toggleSidebar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },

    async fetchZeroTrustStatus({ state }) {
      const { complete } = await Fetch.get('V4/zero.trust.member.status')
      state.moduleSettings['zero-trust'].complete = complete === 1
    },

    async initSidebar({ commit, state }, { path, pathName }) {
      const { userType } = getUserstore()

      let sidebar
      if (userType === 'child') {
        state.roles = ['child']
        const permissions = await getAccessModule()
        console.log(permissions)
        state.permissions = permissions
        sidebar = filterSidebarByPermissions(sidebarMap, state.permissions)
        // sidebar = hideSidebar(sidebarMap, [])

        console.log(sidebarMap, state.permissions)
      } else {
        state.roles = ['root']
        const { plans } = await Fetch.get('V4/member.product.plan', {
          product_flag: 'ADS'
        })

        const { zero_trust_status, complete } = await Fetch.get('V4/zero.trust.member.status')
        const hideList = []
        if (!plans.id) hideList.push('anti-ddos')
        if (!zero_trust_status) hideList.push('zero-trust')

        state.moduleSettings['zero-trust'].complete = complete === 1
        let res
        try {
          res = await Fetch.get('V4/member.set.info.console')
        } catch (e) {
          //
        }
        if (res) {
          if (!res.subacl || res.subacl.status === 'off') hideList.push('access-management')
        }

        sidebar = hideSidebar(sidebarMap, hideList)
      }

      const { defaultOpeneds, groupId } = sidebarFind(sidebar, { path, pathName })

      defaultOpeneds.push(...['activePrevention', 'threatMonitoring', 'securityManagement', 'productSettings'])

      if (state.sidebarGroups && state.sidebarGroups.length) {
        commit('SET_SIDEBAR_GROUP_ID', groupId || state.sidebarGroups[0].id)
      }

      commit('SET_SIDEBAR', {
        sidebar,
        defaultOpeneds
      })
    },

    SET_MODULE_LABEL: (state, { name, data }) => {
      state.moduleLabel[name] = data
    },
    // 获取产品资源
    async fetchModuleLabel({ commit, state }, name) {
      const res = await Axios.get(`/data/modules/${name}/label/${state.language}.json`)
      commit('SET_MODULE_LABEL', { name, data: res.data })
    }
  }
}

function hideSidebar(sidebar, arr) {
  const list = []
  sidebar.forEach(item => {
    if (!arr.includes(item.access)) list.push(item)
  })
  return list
}

function sidebarFind(list, { path, pathName }) {
  const [moduleName] = pathName.split('.')
  const groupMap = {}
  list.forEach(item => {
    groupMap[item.name] = item.groupId
  })

  return {
    defaultOpeneds: [moduleName],
    groupId: groupMap[moduleName]
  }
}

function filterSidebarByPermissions(sidebar, permissions, hideList = []) {
  const list = []
  sidebar.forEach(item => {
    if ((permissions.includes(item.name) || permissions.includes('system')) && !hideList.includes(item.name)) {
      if (item.children && item.children.length) {
        if (item.name === 'user-center') {
          item.children = item.children.filter(_ => permissions.includes(_))
        } else {
          item.children = item.children.filter(_ => permissions.includes(_) || permissions.includes('system'))
        }
        list.push(item)
      } else {
        list.push(item)
      }
      if (item.items && item.items.length) {
        list.push(item)
      }
    }
  })

  return list
}
// 获取子账户授权的产品
async function getAccessModule() {
  const mapData = await Fetch.get('V4/permission.get.info')
  const routerMap = mapData.routers
  const data = await Fetch.get('V4/permission.get.permissionModuleNames')

  const { has_module = {}, module_old_new } = data

  const permissions = [
    'user-center',
    'user-center.router.basicinfo',
    // 子账号路由
    'cloud-speed',
    'cloud-speed.router.businessList',
    'cloud-speed.router.preUpdate',
    // 'cloud-speed.router.configTemplates',
    'cloud-speed.router.certificateList',
    'cloud-speed.router.taskList',
    'cloud-speed.router.statisticsReport',
    'cloud-speed.router.operateLog',
    'scan-plus',
    'service-report',
    'activePrevention',
    'security-operations.router.scan__scanWeb',
    'scan-plus.router.scan-web',
    'security-operations.router.scan__propertys',
    'threatMonitoring',
    'security-operations.router.scan__contentSafe',
    'security-operations.router.scan__usabilityMonitor',
    'scan-plus.router.content-safe',
    'scan-plus.router.usability-monitor',
    'securityManagement',
    'security-operations.router.serviceReport',
    'scan-plus.router.serviceReport',
    'security-operations.router.serviceReport',
    'logs.router.manage',
    'scan-plus.router.ipList',
    'productSettings',
    'scan-plus.router.packages'
  ]

  if (mapData.has_sys_strategy === 1) {
    permissions.push('system')
  }
  // Object.keys(has_module).forEach(key => {
  //   if (module_old_new[key]) {
  //     permissions.push(module_old_new[key].key)
  //   }

  //   const item = has_module[key]

  //   item.forEach(key => {
  //     if (routerMap[key]) {
  //       permissions.push(routerMap[key].router_name)
  //       permissions.push(routerMap[key].path_name)
  //     }
  //   })

  //   permissions.push(...has_module[key])
  // })
  return permissions
}

export default app
