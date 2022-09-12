import Config from '@/core/setup-config'

export function installModulesSettings() {
  const { modules, modulesSettings } = Config

  const settings = {}
  for (const name of modules) {
    const { config } = require(`@/config/modules/${name}`).default
    const { id, settings: itemSettings } = config
    if (itemSettings) {
      if (modulesSettings[id]) {
        Object.assign(itemSettings, modulesSettings[id])
      }
      settings[id] = itemSettings
    }
  }

  return settings
}
