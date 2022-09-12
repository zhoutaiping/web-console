const initAssets = require('./assets')
const initBuildConfig = require('./build-config')

const [, , NUMBER, ENV] = process.argv
const APP_ENV = ENV || 'root'
process.env.APP_ENV = APP_ENV

initBuildConfig()
// 初始化资源配置
initAssets(APP_ENV)
