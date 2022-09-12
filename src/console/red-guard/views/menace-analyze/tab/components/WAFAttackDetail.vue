<template>
  <div>
    <CardInfos
      ref="CardInfos"
      :data="infos"
      :loading="false"
    >
      <template
        slot="waf_risk_score"
        slot-scope="scope"
      >
        <ColumnThreatenLevel v-model="scope.row.value" />
      </template>
    </CardInfos>
    <DmData
      ref="DmData"
      :auto-init="false"
      class="margin-top"
      @init="fetchList"
    >
      <DmTable :loading="loading">
        <el-table :data="list">
          <el-table-column
            prop="Timestamp"
            label="时间"
            min-width="150"
          />
          <el-table-column
            prop="method"
            label="请求方法"
            min-width="80"
          />
          <el-table-column
            prop="request_url"
            label="URL"
            min-width="150"
          >
            <template slot-scope="scope">
              <PopoverEllipsis v-model="scope.row.request_url" />
            </template>
          </el-table-column>
          <el-table-column
            prop="req_headers"
            label="请求头"
            min-width="150"
          >
            <template slot-scope="scope">
              <PopoverEllipsis v-model="scope.row.req_headers" />
            </template>
          </el-table-column>
          <el-table-column
            prop="req_body"
            label="请求体"
            min-width="150"
          >
            <template slot-scope="scope">
              <PopoverEllipsis v-model="scope.row.req_body" />
            </template>
          </el-table-column>
          <el-table-column
            prop="waf_attack_name"
            label="攻击类型"
            min-width="80"
          />
          <el-table-column
            prop="waf_content_zone"
            min-width="100"
          >
            <template
              slot="header"
              slot-scope="scope"
            >
              <ColumnHeaderTips tips="攻击在请求报文中出现的位置">攻击位置</ColumnHeaderTips>
            </template>
          </el-table-column>
          <el-table-column
            label="攻击特征"
            min-width="150"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.is_free_package === 1">
                {{ scope.row.waf_content }}
                <el-tooltip
                  content="免费版暂不支持查看完整攻击特征"
                  placement="top"
                >
                  <a>...</a>
                </el-tooltip>
              </template>
              <template v-else>
                <PopoverEllipsis
                  :url="false"
                  v-model="scope.row.waf_content"
                />
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="User-Agent"
            min-width="150"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                :url="false"
                v-model="scope.row.http_user_agent"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="waf_risk"
            label="行为风险"
            min-width="80"
          >
            <template slot-scope="scope">
              <ColumnThreatenLevel v-model="scope.row.waf_risk" />
            </template>
          </el-table-column>
          <el-table-column
            prop="status_code"
            label="状态码"
            min-width="60"
          />
          <el-table-column
            prop="action"
            label="处置动作"
            min-width="100"
          />
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import consoleDialog from '@/mixins/consoleDialog'
import CardInfos from '@/components/Card/CardInfos'
import ColumnHeaderTips from '@/components/Column/ColumnHeaderTips'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import ColumnThreatenLevel from './components/ColumnThreatenLevel'

export default {
  components: { CardInfos, ColumnHeaderTips, PopoverEllipsis, ColumnThreatenLevel },

  mixins: [consoleDialog, consoleData],

  data() {
    return {
      infos: [
        {
          label: '攻击IP',
          key: 'remoteView'
        },
        {
          label: '开始时间',
          key: 'start_time'
        },
        {
          label: '结束时间',
          key: 'end_time'
        },
        {
          label: '业务',
          key: 'sub_domain'
        },
        {
          label: '攻击次数',
          key: 'all_attack_cnt'
        },
        {
          label: '威胁等级',
          key: 'waf_risk_score',
          component: 'waf_risk_score'
        }
      ],
      API_METHOD: 'post',
      API_INDEX: 'V4/stati.data.get'
    }
  },
  mounted() {
    this.afterOpen(this.$route.query)
  },
  methods: {
    afterOpen(row) {
      this.bindParams = {
        router: 'waf.attack.event.detail',
        remote_addr: row.remote_addr,
        start_time: row.start_time,
        end_time: row.end_time,
        http_host: row.sub_domain
      }
      this.list = []
      this.$nextTick(() => {
        this.$refs.DmData.initPage()
        Object.keys(row).forEach(key => {
          this.$refs.CardInfos.setItemData(key, row[key])
        })
      })
    }
  }
}
</script>
