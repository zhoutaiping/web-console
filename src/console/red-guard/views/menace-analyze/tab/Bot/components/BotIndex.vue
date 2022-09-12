<template>
  <div>
    <el-row :gutter="12">
      <el-col
        v-for="(item, index) in indexData"
        :span="6"
        :key="index"
      >
        <CardIndexMultiple
          :title="item.title"
          :data="item.data"
          :loading="loading"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CardIndexMultiple from '@/components/Card/CardIndexMultiple'

export default {
  components: { CardIndexMultiple },

  data() {
    return {
      loading: true,
      indexData: [
        {},
        {},
        {},
        {}
      ]
    }
  },

  methods: {
    async fetchData(params) {
      this.loading = true
      const data = await this.Fetch.post('V4/stati.data.get', {
        ...params,
        router_type: 'bot',
        meal_flag: ['YD-WAFQJB'],
        router: 'bot.count.percent'
      })

      this.indexData = [
        {
          title: '真人',
          data: [
            {
              label: '请求次数',
              value: data.human_count,
              unit: '次'
            },
            {
              label: '请求占比',
              value: data.human_percent,
              unit: '%'
            }
          ]
        },
        {
          title: '已知合法Bot',
          data: [
            {
              label: '请求次数',
              value: data.bot_known_legal_count,
              unit: '次'
            },
            {
              label: '请求占比',
              value: data.bot_known_legal_percent,
              unit: '%'
            }
          ]
        },
        {
          title: '已知恶意Bot',
          data: [
            {
              label: '请求次数',
              value: data.bot_known_illegal_count,
              unit: '次'
            },
            {
              label: '请求占比',
              value: data.bot_known_illegal_percent,
              unit: '%'
            }
          ]
        },
        {
          title: '未知Bot',
          data: [
            {
              label: '请求次数',
              value: data.bot_unknown_count,
              unit: '次'
            },
            {
              label: '请求占比',
              value: data.bot_unknown_percent,
              unit: '%'
            }
          ]
        }
      ]
      this.loading = false
    }
  }
}
</script>
