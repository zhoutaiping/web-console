<template>
  <div v-if="appReady">
    <a-locale-provider :locale="locale">
      <router-view />
    </a-locale-provider>
  </div>
</template>

<script>
import {LocaleProvider} from 'ant-design-vue'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  components:{ ALocaleProvider: LocaleProvider },
  data() {
    return {
      locale: zhCN
    }
  },

  created() {
    this.getUserinfo()
  }
}
</script>
