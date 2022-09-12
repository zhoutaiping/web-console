import defaultSettings from '@/config/defaultSettings'
import setupConfig from '@/core/setup-config'

describe('defaultSettings', () => {

  it ('setupConfig', () => {
    expect(defaultSettings.name).toBe(setupConfig.name);
  })
})