<template>
  <span>
    <SelectMultipleMany
      :fetch-data="fetchData"
      v-model="value"
      :size="500"
      :total="total"
      @update="handleUpdate"
      @submit="handleSubmit"
    />
  </span>
</template>

<script>
import SelectMultipleMany from '@/components/Select/SelectMultipleMany'

const CONN = '<<-->>' // 域名与IP的连接符

export default {
  components: { SelectMultipleMany },

  props: {
    value: Array
  },

  data() {
    return {
      total: 0
    }
  },

  methods: {
    // 生成域名与 IP 数据
    generateDomainMap(sub_domain, list) {
      const domainMap = {}

      sub_domain.forEach(_ => {
        domainMap[_] = []
      })

      list.filter(_ => _.includes(CONN)).forEach(item => {
        const [domain, node] = item.split(CONN)
        domainMap[domain] && domainMap[domain].push(node)
      })

      return domainMap
    },

    handleSubmit(value) {
      // 提取域名列表 + 去重
      const selectSet = new Set()
      value.forEach(_ => {
        _.includes(CONN) ? selectSet.add(_.split(CONN)[0]) : selectSet.add(_)
      })
      const sub_domain = [...selectSet]

      const sub_domains_and_node_ips = this.generateDomainMap(sub_domain, value)
      this.$emit('submit', {
        sub_domain,
        sub_domains_and_node_ips
      })
    },

    handleUpdate({ total }) {
      this.total = total
    },

    async fetchData(params) {
      const res = await this.Fetch.get('V4/Web.All.Domains', {
        ...params,
        domain: params.keyword
      })

      const list = res.list.map(_ => {
        return {
          label: _.domain,
          value: _.domain
        }
      })

      return {
        list,
        total: Number(res.total)
      }
    }
  }
}
</script>
