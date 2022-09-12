<template>
  <yd-card
    horizontal
    title="网络安全"
  >
    <template slot="tips">
      <p>基于 DNS 安全流量接管，隐藏源服务器IP</p>
    </template>
  </yd-card>
</template>

<script>
import create from '@/utils/create-basic'

export default create({
  name: 'CardNetwork'
})
</script>
