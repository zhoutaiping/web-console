module.exports = {
  name: 'yundun',
  theme: 'primary',
  layout: 'yundun',
  language: 'zh',
  modules: [
    'home',
    'cloud-speed',
    'cloud-resolving',
    'scan-plus',
    'logs',
    'red-guard',
    'taichi-app',
    'service-report',
    'user-center',
    'access-management',
    'finance-center',
    'cloud-wall',
    'message-center',
    'anti-ddos',
    'zero-trust',
    'security-operations'
  ],
  modulesSettings: {
    'home': {},
    'zero-trust': {},
    'cloud-wall': {
      ssa: false
    }
  },
  consoleUrl: '/console',
  consoleHome: '/console/home',
  languages: ['zh', 'cht', 'en'],
  assets: {
    logoConsole: 'https://yundun-statics.yundun.com/FhY5nYFKu3WQhtt0eGe_r4Meo7be',
    logoConsoleC: 'https://yundun-statics.yundun.com/FmzwIlZ27jPqnAAnbNU5oZtP2pQh',
    logoBackground: '',
    company: '上海云盾',
    titleSuffix: '',
    companyEN: 'YUNDUN',
    beforeKF: 'groupToken:997936948c0aa9c813a1b34fb8b91d3d',
    afterKF: 'groupToken:667bfdfb001c7f327f7a8bbf2686ef61',
    tel: '400-800-9189',
    productNav: false
  },
  sidebar: [],
  sidebarGroups: [],
  storageOptions: { // Vue-ls
    namespace: 'pro__', // key prefix
    name: 'ls', // name variable Vue.[ls] or this.[$ls],
    storage: 'local' // storage name session, local, memory
  }
}
