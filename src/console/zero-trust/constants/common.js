const APP_TYPE = {
  HOST: 0,
  PROTOCOL: 1,
  SAAS: 2
}

const APP_ACCESS_MODE = {
  BROWSER: 1,
  CLIENT: 2,
  CLIENT_PROXY: 3
}

const selectAccessMode = [
  {
    label: '浏览器模式',
    value: APP_ACCESS_MODE.BROWSER
  },
  {
    label: '客户端隧道模式',
    value: APP_ACCESS_MODE.CLIENT
  },
  {
    label: '客户端代理模式',
    value: APP_ACCESS_MODE.CLIENT_PROXY
  }
]

export {
  APP_TYPE,
  APP_ACCESS_MODE,
  selectAccessMode
}
