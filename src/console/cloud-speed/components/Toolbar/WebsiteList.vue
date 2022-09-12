<template>
  <TransferItem
    ref="TransferItem"
    :fetch-data="fetchData"
    v-model="value"
    :size="500"
    :conn="CONN"
    total-type="root"
    @update="handleUpdate"
  />
</template>

<script>
import TransferItem from '@/components/Transfer/TransferItem'

const CONN = '<<-->>' // 域名与IP的连接符

export default {
  components: { TransferItem },

  props: {
    childrenVisible: Boolean
  },

  data() {
    return {
      CONN,
      value: [],
      total: 0,
      rootTotal: 0
    }
  },

  watch: {
    childrenVisible() {
      this.$refs.TransferItem.init()
    }
  },

  methods: {
    init() {
      this.$refs.TransferItem.init()
    },
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

    getValue() {
      const value = this.value
      // 提取域名列表 + 去重
      const selectSet = new Set()
      value.forEach(_ => {
        _.includes(CONN) ? selectSet.add(_.split(CONN)[0]) : selectSet.add(_)
      })
      const sub_domain = [...selectSet]

      const sub_domains_and_node_ips = this.generateDomainMap(sub_domain, value)

      return {
        sub_domain,
        sub_domains_and_node_ips,
        total: this.total,
        rootTotal: this.rootTotal
      }
    },

    handleUpdate({ total, rootTotal }) {
      this.total = total
      this.rootTotal = rootTotal
    },

    async fetchData(params) {
      try {
        const res = await this.Fetch.get('V4/Web.All.Domains', {
          ...params,
          domain: params.keyword
        })
        const list = res.list.map(_ => {
          let children
          if (_.nodes && Array.isArray(_.nodes)) {
            children = _.nodes.map(node => {
              return {
                label: node,
                value: `${_.domain}${CONN}${node}`
              }
            })
          }
          return {
            label: _.domain,
            value: _.domain,
            children: this.childrenVisible ? children : []
          }
        })
        return {
          list,
          total: Number(res.total) || 0
        }
      } catch (e) {
        return {
          list: [],
          total: 0
        }
      }
    }
  }
}
</script>
