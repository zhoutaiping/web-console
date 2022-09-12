<template>
  <CardItemForm
    :loading="false"
    is-init
    is-support
    title="IP行为分析"
  >
    <template slot="tips">
      <p>基于大数据机器学习算法分析，提炼网站正常业务行为特征，为不同业务场景的网站提供针对性的防护服务。</p>
    </template>
    <DmAlert>
      1.因需请求数据提炼网站业务特征，因此不建议刚接入或长时间不存在请求数据的业务使用；<br>
      2.系统以5分钟为粒度，通过对比访客行为与业务特征，自动调整访客风险等级；<br>
      3.由<router-link to="./waf">精准访问控制引擎</router-link>驱动，开启防御后具体防御策略配置请至<router-link to="./waf">精准访问控制引擎</router-link>查看；
    </DmAlert>
    <a @click="$refs.ChartIPAnalysis.handleOpen()">查看风险IP数量走势</a>
    <ChartIPAnalysis
      ref="ChartIPAnalysis"
      :domain="domainInfo.domain"
    />
  </CardItemForm>
</template>

<script>
import ChartIPAnalysis from './ChartIPAnalysis'

export default {
  name: 'IpAnalysis',

  components: {
    ChartIPAnalysis
  }
}
</script>
