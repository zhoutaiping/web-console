<template>
  <yd-card-list>
    <!-- 篡改监控 -->
    <TamperingMonitoring
      ref="TamperingMonitoring"
      @init="fetchInfo"
    />
    <!-- 敏感词监控 -->
    <SensitiveWordMonitoring
      ref="SensitiveWordMonitoring"
      @init="fetchInfo"
    />
    <!-- 风险外链监控 -->
    <OuterInspectMonitoring
      ref="OuterInspectMonitoring"
      @init="fetchInfo"
    />
    <!-- 恶意链接监控 -->
    <MaliciousLinkmonitoring
      ref="MaliciousLinkmonitoring"
      @init="fetchInfo"
    />
    <!-- 关键词监控 -->
    <KeywordMonitoring
      ref="KeywordMonitoring"
      @init="fetchInfo"
    />
    <!-- 异常监控 -->
    <AbnormalMonitoring
      ref="AbnormalMonitoring"
      @init="fetchInfo"
    />
  </yd-card-list>
</template>

<script>
import TamperingMonitoring from './components/TamperingMonitoring'
import SensitiveWordMonitoring from './components/SensitiveWordMonitoring'
import OuterInspectMonitoring from './components/OuterInspectMonitoring'
import MaliciousLinkmonitoring from './components/MaliciousLinkmonitoring'
import KeywordMonitoring from './components/KeywordMonitoring'
import AbnormalMonitoring from './components/AbnormalMonitoring'
import mixins from './components/mixins'

export default {
  components: {
    TamperingMonitoring,
    SensitiveWordMonitoring,
    OuterInspectMonitoring,
    MaliciousLinkmonitoring,
    KeywordMonitoring,
    AbnormalMonitoring
  },

  mixins: [mixins],

  created() {
    this.fetchInfo()
  },

  methods: {
    async fetchInfo() {
      const res = await this.Fetch.get('V4/content.safe.monitor.detail', { uuid: this.id })
      const data = res

      this.$refs.TamperingMonitoring.init(data)
      this.$refs.SensitiveWordMonitoring.init(data)
      this.$refs.MaliciousLinkmonitoring.init(data)
      this.$refs.KeywordMonitoring.init(data)
      this.$refs.AbnormalMonitoring.init(data)
      this.$refs.OuterInspectMonitoring.init(data)
    }
  }
}
</script>
