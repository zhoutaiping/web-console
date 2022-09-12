import Config from '@/core/setup-config'
import deepmerge from 'deepmerge'

function installModules(lang) {
  const { modules, modulesSettings } = Config
  const data = {}
  for (const name of modules) {
    const { config, locale } = require(`@/config/modules/${name}`).default
    const { id: moduleId } = config

    const rootLocale = modulesSettings[moduleId]

    if (locale && locale[lang]) {
      let localeData = locale[lang]
      if (rootLocale && rootLocale.locale && rootLocale.locale[lang]) {
        localeData = deepmerge(localeData, rootLocale.locale[lang])
      }
      data[moduleId] = localeData
    }
  }

  return data
}

export default installModules
