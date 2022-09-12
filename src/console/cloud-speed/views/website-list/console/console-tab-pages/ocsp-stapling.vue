<template>
  <yd-card horizontal title="OCSP Stapling">
    <div slot="action">
      <el-select
        v-model="status"
        disabled
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
    <template slot="tips">浏览器需要使用 OCSP 服务检验网站证书的合法性，这里由优化节点获取网站证书的状态，主动推送给浏览器，避免因此造成的用户访问延迟</template>
  </yd-card>
</template>

<script>
export default {
  name: 'OcspStapling',
  data() {
    return {
      options: [
        {
          value: 'on',
          label: 'ON'
        },
        {
          value: 'off',
          label: 'OFF'
        }
      ],
      status: 'on'
    }
  }
}
</script>
