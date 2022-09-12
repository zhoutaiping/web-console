<template>
  <div>
    <!-- 已开通服务 -->
    <DmCard
      :class="b()"
      :loading="loading"
      title="已开通服务"
    >
      <el-row>
        <el-col
          v-for="(item, index) in onList"
          :span="6"
          :key="index"
        >
          <router-link :to="`/console/${item.path}`">
            <ItemService
              :title="item.title"
              :icon="item.icon"
              :tips="item.tips"
            />
          </router-link>
        </el-col>
      </el-row>
    </DmCard>
    <!-- 未开通服务 -->
    <DmCard
      v-if="offList.length"
      :class="b()"
      :loading="loading"
      class="margin-top"
      title="未开通服务"
    >
      <el-row>
        <el-col
          v-for="(item, index) in offList"
          :span="6"
          :key="index"
        >
          <router-link :to="item.path">
            <ItemService
              :title="item.title"
              :icon="item.icon"
            />
          </router-link>
        </el-col>
      </el-row>
    </DmCard>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import ItemService from '@/components/Item/ItemService'

const KEY_MAP = {
  cloudDns: 'cloud-resolving',
  cloudSpeed: 'cloud-speed',
  hwws: 'red-guard',
  cloudMonitor: 'scan-plus',
  tjkdPlus: 'cloud-wall',
  tjkdApp: 'taichi-app'
}

export default create({
  name: 'CardOpenService',

  components: { ItemService },

  data() {
    return {
      loading: true,
      onList: [],
      offList: []
    }
  },

  computed: {
    moduleList() {
      return this.$store.state.app.moduleList
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    itemHander(data) {
      const id = KEY_MAP[data.name]
      const config = this.moduleList.find(_ => _.id === id) || {}

      let tips
      let open = true
      if (id === 'cloud-resolving') {
        tips = `${data.total}个域名，${data.off}个未接入`
      } else if (id === 'scan-plus') {
        tips = `${data.total}个监控项，${data.off}个宕机`
      } else if (id === 'cloud-speed') {
        tips = `${data.total}个域名`
      } else if (['cloud-wall', 'taichi-dns', 'taichi-app'].includes(id)) {
        tips = `${data.total}个套餐`
        open = Boolean(data.total)
      }

      return {
        title: this.$t(config.name),
        icon: config.icon,
        tips,
        path: config.baseUrl,
        open
      }
    },

    async fetchTaichi() {
      const data = await this.Fetch.get('V4/overview.home.gettjkdinfo')
      const { serviceList } = data
      const list = []
      Object.keys(serviceList).forEach(key => {
        list.push(serviceList[key])
      })
      return list
    },

    async fetchHome() {
      const data = await this.Fetch.get('V4/overview.home.getbaseapplicationinfo')
      const { serviceList = [] } = data
      return serviceList
    },

    async fetchData() {
      const list = []
      list.push(...await this.fetchHome())
      list.push(...await this.fetchTaichi())

      const sList = list.map(this.itemHander).filter(_ => _.title)
      this.onList = sList.filter(_ => _.open === true)
      this.offList = sList.filter(_ => _.open === false)
      this.loading = false
    }
  }
})
</script>
