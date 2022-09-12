const APP_NAME = 'yundun'
process.env.VUE_APP_NAME = APP_NAME

const defaultConfig = require('./src/config/defaultSettings')
const appConfig = require(`./config/agents/${APP_NAME}`)
const deepmerge = require('deepmerge')
const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
const Config = deepmerge(defaultConfig, appConfig)
const API_URL = process.env.API_URL || 'http://homev5.test.nodevops.cn'
const BUILD_MODE = process.env.BUILD_MODE

module.exports = {
  lintOnSave: true,
  publicPath: BUILD_MODE === 'docker' ? '/console/' : '/',
  pwa: {
    'background_color': '#fff',
    'theme_color': '#2991FA',
    'start_url': '/index.html',
    iconPaths: {}
    // workboxPluginMode: 'InjectManifest'
    // workboxOptions: {
    //   swSrc: './sw.js'
    // }
  },
  chainWebpack: (config) => {
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .type('javascript/auto')
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end()

    config.resolve.alias
      .set('layout', resolve(`src/layouts/${Config.layout}`))
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })
  },
  productionSourceMap: false,
  css: {
    loaderOptions: {
      sass: {
        data: `@import "./src/styles/theme/${Config.theme}.scss";`
      },
      less: {
        javascriptEnabled: true
      }
    }
  },
  assetsDir: 'static',
  devServer: {
    proxy: {
      '^/api': {
        target: API_URL,
        changeOrigin: true
      },
      '^/agw': {
        target: API_URL,
        changeOrigin: true
      },
      '/static': {
        target: 'http://yundun.test.nodevops.cn',
        changeOrigin: true
      },
      '/_nuxt': {
        target: 'http://yundun.test.nodevops.cn',
        changeOrigin: true
      },
      '^/login': {
        target: 'http://yundun.test.nodevops.cn',
        changeOrigin: true
      },
      '^/register': {
        target: 'http://yundun.test.nodevops.cn',
        changeOrigin: true
      }
    }
  },
  pluginOptions: {
    storybook: {
      allowedPlugins: ['define']
    }
  }
}
