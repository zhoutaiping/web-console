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
              <span class="span-text">
                {{scope.row.req_headers}}
              </span>
              <!-- <PopoverEllipsis v-model="scope.row.request_headers" /> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="req_body"
            label="请求体"
            min-width="150"
          >
            <template slot-scope="scope">
              <span class="span-text">
                {{scope.row.req_body}}
              </span>
              <!-- <PopoverEllipsis v-model="scope.row.request_body" /> -->
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
            prop="status_code"
            label="状态码"
            min-width="60"
          />
          <el-table-column
            prop="suggestion"
            label="加固建议"
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
  components: { CardInfos, ColumnHeaderTips, ColumnThreatenLevel, PopoverEllipsis },

  mixins: [consoleDialog, consoleData],

  data() {
    return {
      row: {},
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
          key: 'remote_addr'
        },
        {
          label: '攻击次数',
          key: 'all_attack_cnt'
        },
        {
          label: '威胁等级',
          key: 'waf_risk_score',
          component: 'waf_risk_score'
        },
        {
          label: '入侵方式',
          key: 'webshell_type'
        },
        {
          label: 'WebShell',
          key: 'url'
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
      this.row = row
      this.bindParams = {
        router: 'waf.webshell.event.detail',
        remote_addr: row.remote_addr,
        start_time: row.start_time,
        end_time: row.end_time,
        request_url: row.url
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
<style lang="scss" scoped>
.span-text {
  width: 150px;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2; /* 这里是超出几行省略 */
  overflow: hidden;
}
</style>
