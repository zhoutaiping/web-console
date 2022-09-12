import Vue from 'vue'
import Element from 'element-ui'
import VueI18n from 'vue-i18n'
import Config from '@/core/setup-config'
import axios from 'axios'
import messages from '@/core/lang/zh'

Vue.use(VueI18n)
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})

const language = Config.language

const i18n = new VueI18n({
  locale: language,
  fallbackLocale: language,
  messages: {
    zh: messages
  }
})

const loadedLanguages = [language]
setAxios(language)

function setAxios(lang) {
  axios.defaults.headers.common['Accept-Language'] = lang
  axios.defaults.headers.common['lang'] = lang
}

function setI18nLanguage(lang) {
  i18n.locale = lang
  document.querySelector('html').setAttribute('lang', lang)
  setAxios(lang)
  return lang
}

export function loadLanguageAsync(lang) {
  if (i18n.locale !== lang) {
    if (!loadedLanguages.includes(lang)) {
      // TODO TypeError: Cannot read property 'range' of null 依赖错误，暂时无法编译
      // return import(/* webpackChunkName: "lang-[request]" */ `@/core/lang/${lang}`).then(msgs => {
      //   i18n.setLocaleMessage(lang, msgs.default)
      //   loadedLanguages.push(lang)
      //   return setI18nLanguage(lang)
      // })
      const msgs = require(`@/core/lang/${lang}`)
      i18n.setLocaleMessage(lang, msgs.default)
      loadedLanguages.push(lang)
      return setI18nLanguage(lang)
    }
    return Promise.resolve(setI18nLanguage(lang))
  }
  return Promise.resolve(lang)
}

export default i18n
