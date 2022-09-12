<template>
  <yd-card
    horizontal
    title="防DDoS"
  >
    <template slot="tips">
      <template v-if="join_tcp">
        <p>已开启套餐所分配的资源池内全力防御服务</p>
      </template>
      <template v-else>
        <template v-if="domainPlanInfo.meal_flag === 'YD-WEBAQJS-TY'">
          <p>当前服务不支持，如遇 DDoS 攻击，{{ appAssets.companyEN }} 会将域名解析回源停止服务，您可以 <TipsButton>联系商务</TipsButton> 开通此项功能</p>
        </template>
        <template v-else>
          <p>已开启套餐所分配的资源池内全力防御服务</p>
        </template>
      </template>
    </template>
  </yd-card>
</template>

<script>
import create from '@/utils/create-basic'
import domain from '@/mixins/domain'

export default create({
  name: 'CardDDos',
  mixins: [domain],
  computed: {
    join_tcp() {
      return this.domainInfo && this.domainInfo.join_tcp || false
    }
  }
})
</script>
