<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增应用</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleDelete"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.app_name"
          placeholder="应用名称"
          @submit="handleSearch"
        />
      </div>
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        min-height
      >
        <el-table
          :data="list"
          @selection-change="handleRowSelect"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="应用名称"
            min-width="140"
          >
            <template slot-scope="scope">
              {{ scope.row.app_name }}
              <TipsTooltip v-if="scope.row.app_type === 0 && scope.row.app_access_mode === 1 && scope.row.protocol === 0">
                为保障流量传输安全．建议为该域名配置 <a href="/console/cloud-speed/certificateList">SSL证书</a> ，使用HTTPS协议
              </TipsTooltip>
            </template>
          </el-table-column>
          <el-table-column
            label="URL / IP"
            min-width="200"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.app_access_mode === APP_ACCESS_MODE.BROWSER">
                {{ scope.row.domain }}/{{ scope.row.domain_path }}
              </template>
              <template v-else-if="scope.row.app_access_mode === APP_ACCESS_MODE.CLIENT_PROXY">

                <template v-if="scope.row.client_access_conf__proxy_forwarding_profile">
                  <ColumnList
                    :num="1"
                    :list="scope.row.client_access_conf.proxy_forwarding_profile.map(_ => `${_.domain}:${_.port}` )"
                  />
                  <!-- {{ scope.row.client_access_conf__proxy_forwarding_profile.domain }}:{{ scope.row.client_access_conf__proxy_forwarding_profile.port }} -->
                </template>
              </template>
              <template v-else>
                <ColumnList
                  :num="1"
                  :list="scope.row.client_access_conf__forwarding_profile.map(_ => _.domain)"
                />
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="应用 ID"
            min-width="250"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                v-model="scope.row.app_uuid"
                :url="false"
                :max-length="30"
                line-feed
              />
              <el-button
                type="text"
                @click="handleCopy(scope.row.app_uuid)"
              >复制</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="访问模式"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.app_access_mode | labelView(selectAccessMode) }}
            </template>
          </el-table-column>
          <el-table-column
            label="AUD 标签"
            min-width="250"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                v-model="scope.row.aud"
                :url="false"
                :max-length="30"
                line-feed
              />
              <el-button
                type="text"
                @click="handleCopy(scope.row.aud)"
              >复制</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="应用访问规则"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnRuleCount
                :bypass="scope.row.bypass_rule_count"
                :deny="scope.row.deny_rule_count"
                :allow="scope.row.allow_rule_count"
                @click="$refs.DialogRule.handleOpen(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            min-width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.description || '-' }}
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.DialogRule.handleOpen(scope.row)"
              >规则配置</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
      @open-settings="handleOpenSettings()"
    />
    <DialogRule
      ref="DialogRule"
      application-type="host"
      @init="fetchList"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import ColumnList from '@/components/Column/ColumnList'
import DialogRow from './components/DialogRow'
import DialogRule from './components/DialogRule'
import ColumnRuleCount from '../../components/ColumnRuleCount'
import { selectAccessMode, APP_ACCESS_MODE } from '../../constants/common'

export default {
  components: { PopoverEllipsis, ColumnList, DialogRow, DialogRule, ColumnRuleCount },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/zero.trust.app.list',
      selectAccessMode,
      APP_ACCESS_MODE,
      bindParams: {
        app_name: '',
        app_type: 0
      },
      selectionId: []
    }
  },

  methods: {
    handleOpenSettings() {
      this.$refs.DialogRule.handleOpen(this.list[0])
    },

    handleCopy(text) {
      this.Help.copyText(text)
      this.$message.success('复制成功')
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.app_uid)
    },

    formatResponse(response) {
      response.list.forEach(form => {
        if (form.client_access_conf) {
          form.client_access_conf__forwarding_profile = form.client_access_conf.forwarding_profile
          form.client_access_conf__exceptions = form.client_access_conf.exceptions

          if (form.client_access_conf?.proxy_forwarding_profile?.length) {
            form.client_access_conf__proxy_forwarding_profile = form.client_access_conf.proxy_forwarding_profile[0]
            form.client_access_conf__proxy_forwarding_profile__back_to_origins = form.client_access_conf.proxy_forwarding_profile[0].back_to_origins
          }
        }

        if (form.app_access_mode === APP_ACCESS_MODE.CLIENT_PROXY) {
          form.client_access_conf__forwarding_profile__CLIENT_PROXY = form.client_access_conf.proxy_forwarding_profile.filter(item => !item.type)
          form.client_access_conf__forwarding_profile__CLIENT_PROXY_IP = form.client_access_conf.proxy_forwarding_profile.filter(item => item.type)
          console.log(form.client_access_conf__forwarding_profile__CLIENT_PROXY_IP);
        }
      })
      return response
    },

    handleDelete() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.post('V4/zero.trust.app.del', { ids: this.selectionId })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    }
  }
}
</script>
