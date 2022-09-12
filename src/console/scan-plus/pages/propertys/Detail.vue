<template>
  <console-page-layout :tabs="navbar">
    <router-view />
  </console-page-layout>
</template>

<script>

export default {
  data() {
    return {
      info: {},
      dnsList: [],
      monitorList: [],
      navbar: []
    }
  },

  created() {
    const type = this.$route.query.property_type
    if (Number(type) === 0) {
      this.navbar = [
        {
          title: '服务信息',
          name: 'security-operations.router.scan__propertys__id__service-info'
        },
        {
          title: '内容安全',
          name: 'security-operations.router.scan__propertys__id__content-safe-event'
        },
        {
          title: 'Web漏洞扫描',
          name: 'security-operations.router.scan__propertys__id__scan-web-setting'
        }
        // {
        //   title: 'DNS劫持风险',
        //   name: 'security-operations.router.scan__propertys__id__dns-monitor-event'
        // }
      ]
    } else {
      this.navbar = [
        {
          title: '内容安全',
          name: 'security-operations.router.scan__propertys__id__content-safe-event'
        },
        {
          title: '服务可用性风险',
          name: 'security-operations.router.scan__propertys__id__usability-monitor-event'
        },
        {
          title: 'Web漏洞扫描',
          name: 'security-operations.router.scan__propertys__id__scan-web-setting'
        }
      ]
    }
  },

  methods: {
    async fetchInfo() {
      const params = {
        property_id: this.$route.params.id
      }
      const data = await this.Fetch.post('V4/smgc.property.info', params)
      this.info = data.info
      this.dnsList = data.dns_hijack_task_list
      this.monitorList = data.monitor_task_list
    }
  }
}
</script>
