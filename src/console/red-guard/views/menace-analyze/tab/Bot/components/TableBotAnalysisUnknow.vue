<template>
  <div>
    <DmCard title="未知Bot活动分析">
      <DmData
        ref="DmData"
        :auto-init="false"
        @init="initPage"
      >
        <DmTable :loading="loading">
          <el-table
            :data="list"
            @select="handleRowSelect"
            @select-all="handleRowSelect"
          >
            <el-table-column
              label="未知Bot类别"
              prop="bot_name"
              min-width="100"
            />
            <el-table-column
              label="Bot特征"
              min-width="250"
            >
              <template slot-scope="scope">
                <ColumnListMore
                  v-if="scope.row.bot_features.length"
                  v-model="scope.row.bot_features"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="业务"
              prop="http_host"
              min-width="150"
            />
            <el-table-column
              label="威胁等级 | Bot概率 | 总会话次数"
              min-width="150"
            >
              <template slot-scope="scope">
                <ColumnThreatLevel v-model="scope.row.level" />
                <el-divider direction="vertical" />
                {{ scope.row.bot_probobility }} %
                <el-divider direction="vertical" />
                {{ scope.row.count | numView }}
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="right"
              width="150"
            >
              <template slot-scope="scope">
                <ColumnAction>
                  <router-link
                    v-if="isSupport"
                    :to="{
                      name: 'cloud-speed.router.menaceAnalyze__BotUnknowDetailIid',
                      params: {id: scope.row.bot_type},
                      query: { start_time: bindParams.start_time, end_time: bindParams.end_time, sub_domain: [scope.row.http_host] }
                  }">
                    <el-button type="text">查看详情</el-button>
                  </router-link>
                  <el-button
                    v-else
                    disabled
                    type="text"
                  >查看详情</el-button>
                </ColumnAction>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmData>
    </DmCard>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import { vPagination } from '@/utils/array'
import ColumnListMore from '@/components/Column/ColumnListMore'
import ColumnThreatLevel from '@/components/Column/ColumnThreatLevel'

export default {
  components: { ColumnListMore, ColumnThreatLevel },

  mixins: [consoleData],

  props: {
    isSupport: Boolean
  },

  data() {
    return {
      API_INDEX: 'V4/stati.data.get',
      API_METHOD: 'post',
      bindParams: {
        start_time: '',
        end_time: '',
        sub_domain: [],
        router_type: 'bot',
        meal_flag: ['YD-WAFQJB'],
        router: 'bot.analysis.unknown'
      },
      selectionId: []
    }
  },

  methods: {
    formatResponse(response) {
      this.listRaw = response.bot_list
      this.$refs.DmData.init({ total: this.listRaw.length })
      this.$refs.DmData.initPage()
      this.initPage({ page: 1, per_page: 10 })
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    },

    initPage(params) {
      if (params.start_time) this.bindParams.start_time = params.start_time
      if (params.end_time) this.bindParams.end_time = params.end_time
      if (params.sub_domain) this.bindParams.sub_domain = params.sub_domain
      this.list = vPagination(this.listRaw, params.page, params.per_page)
    }
  }
}
</script>
