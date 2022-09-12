<style lang="scss">
.CardMessages {
  .el-tabs {
    &__nav {
      border-radius: 0px !important;
    }

    &__item {
      font-size: 12px;
      height: 32px;
      line-height: 32px;
    }
  }
}
</style>

<template>
  <DmCard
    :class="b()"
    :loading="loading"
    title="消息通知"
  >
    <router-link
      slot="action"
      to="/console/message-center"
    >
      <el-button type="text">查看更多</el-button>
    </router-link>
    <el-tabs
      v-model="activeName"
      type="card"
    >
      <el-tab-pane
        v-for="(item, index) in tabs"
        :name="item.id"
        :key="index"
        :label="item.title"
      >
        <ItemMessage
          v-for="(item, index) in list[item.id]"
          :key="index"
          :item="item"
        />
      </el-tab-pane>
    </el-tabs>
  </DmCard>
</template>

<script>
import create from '@/utils/create-basic'
import ItemMessage from '@/components/Item/ItemMessage'

export default create({
  name: 'CardMessages',

  components: { ItemMessage },

  data() {
    return {
      loading: true,
      activeName: 'service_notice',
      list: {
        account_notice: [],
        event_notice: [],
        fault_notice: [],
        security_notice: [],
        service_notice: []
      },
      tabs: [
        {
          title: '服务消息',
          id: 'service_notice'
        },
        {
          title: '安全消息',
          id: 'security_notice'
        },
        {
          title: '故障消息',
          id: 'fault_notice'
        },
        {
          title: '活动消息',
          id: 'event_notice'
        }
      ]
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    listHander(list) {
      return list.map(_ => {
        return {
          title: _.msg_title,
          date: _.notice_time,
          id: _.id,
          isRead: Boolean(_.read_flag)
        }
      })
    },

    async fetchData() {
      const data = await this.Fetch.get('V4/messagecenter.home.getmessagelist')

      Object.keys(data.list).forEach(key => {
        this.list[key] = this.listHander(data.list[key])
      })
      this.loading = false
    }
  }
})
</script>
