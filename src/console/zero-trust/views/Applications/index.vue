<template>
  <ConsolePageLayout :tabs="navbar">
    <DmAlert>
      1. 自建应用：通过cname/ns接入到YUNDUN平台的应用<br>
      2. 协议应用：可使用YUNDUN提供的协议应用服务远程连接到服务器，支持的协议类型包括：SSH、VNC、RDP<br>
      3. SaaS应用：未托管在YUNDUN的应用，需要根据应用类型进行额外设置。YUNDUN-SAML服务提供商元数据URL：<a :href="metaData.xml_idp_metadata" target="_blank">{{ metaData.xml_idp_metadata }}</a><br>
    </DmAlert>
    <router-view />
  </ConsolePageLayout>
</template>

<script>
export default {
  data() {
    return {
      navbar: [
        {
          name: 'zero-trust.router.hostApplications'
        },
        {
          name: 'zero-trust.router.protocolApplication'
        },
        {
          name: 'zero-trust.router.saasApplication'
        }
      ],
      metaData: {}
    }
  },

  created() {
    this.fetchMetadata()
  },

  methods: {
    async fetchMetadata() {
      this.metaData = await this.Fetch.get('V4/zero.trust.xml.metadata')
    }
  }
}
</script>
