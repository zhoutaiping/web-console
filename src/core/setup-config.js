import defaultSettings from '@/config/defaultSettings'
import deepmerge from 'deepmerge'
const APP_NAME = 'yundun'

let config
if (APP_NAME) {
  config = require(`../../config/agents/${APP_NAME}`)
}

export default deepmerge(defaultSettings, config)
