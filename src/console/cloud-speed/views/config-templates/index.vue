<style lang="scss">
.ColumnSettingContentGroup {
  display: flex;

  strong {
    font-weight: 500;
    flex: 0 0 130px;
  }
}
</style>

<template>
  <console-page-layout>
    <DmAlert>
      <p>1. 创建配置模板后，您可将模板中的防护配置批量绑定至{{ $t('cloud-speed.title') }}业务中，现有套餐若不支持某功能时，该功能将无法配置</p>
      <p>2. 业务绑定模板后，业务配置将不可回滚，请确认您的配置模板和绑定的业务无误</p>
      <p>3. 业务绑定模板后，您若在网站列表-控制台修改防护配置将自动解绑配置模板</p>
    </DmAlert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleCreate"
      >新增模板</el-button>
      <el-button
        :disabled="selectionId.length === 0"
        @click="handleDelete"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.keyword"
          placeholder="请输入模板名称进行查询"
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
            prop="name"
            label="模板名称"
            min-width="120px"
          />
          <el-table-column
            prop="remark"
            label="备注"
            min-width="100px"
          />
          <el-table-column
            label="已绑定业务"
            min-width="250px"
          >
            <template slot-scope="scope">
              <template v-for="(item, index) in scope.row.domainsList">
                <el-divider
                  v-if="index > 0"
                  :key="index"
                  direction="vertical"
                />
                <router-link
                  :key="index"
                  :to="{
                    name: 'cloud-speed.router.websiteList__console__id',
                    query: {
                      pageTitle: item
                    },
                    params: {
                      id: scope.row.domainsId[index]
                    }
                  }"
                >
                  <span>
                    {{ item }}
                  </span>
                </router-link>
              </template>
              <template v-if="scope.row.domainsList.length === 0">
                未绑定
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="防护配置"
            min-width="350px"
          >
            <template slot-scope="scope">
              <div
                v-for="(item, index) in scope.row.settingContent"
                :key="index"
                class="ColumnSettingContentGroup"
              >
                <strong>{{ item.title }}：</strong>
                <ColumnSettingContent
                  :row="{name: item.name}"
                  :set-form="scope.row.detail"
                  :data="item.data"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="create_at"
            label="创建时间"
            min-width="150px"
          />
          <el-table-column
            label="操作"
            min-width="200px"
            align="right"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  type="text"
                  @click="handleRowEdit(scope.row)"
                >修改</el-button>
                <el-button
                  type="text"
                  @click="$refs.DialogLog.handleOpen(scope.row)"
                >修改记录</el-button>
                <el-button
                  type="text"
                  @click="handleRowBind(scope.row)"
                >绑定至业务</el-button>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogLog ref="DialogLog" />
    <DialogBind
      ref="DialogBind"
      @init="fetchList"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnListMore from '@/components/Column/ColumnListMore'
import SelectTransfer from '@/components/Select/SelectTransfer'
import selectMixins from '@/mixins/select'
import DialogBind from './components/DialogBind'
import DialogLog from './components/DialogLog'
import ColumnSettingContent from './components/ColumnSettingContent'
// import configItem from '../../constants/config-item'
import { KEY_MAP } from '../../constant/settingsConfig'

export default {
  components: { DialogBind, DialogLog, SelectTransfer, ColumnListMore, ColumnSettingContent },

  mixins: [consoleData, selectMixins],

  data() {
    return {
      API_METHOD: 'post',
      API_INDEX: 'V4/cdntpl.list',
      bindParams: {
        keyword: ''
      },
      selectionId: []
    }
  },

  mounted() {
    this.domainFetchPlanInfo()
    this.fetchWallDomains()
  },

  methods: {
    checkAbailable() {
      // TODO
      if (this.domainPlanInfo.meal_flag === 'YD-WEBAQJS-TY') {
        this.$message.warning('当前套餐版本不支持，请购买套餐至高级版及以上')
        throw new Error()
      }
    },

    async handleCreate() {
      this.checkAbailable()
      this.$router.push({ name: 'cloud-speed.router.configTemplates__create' })
    },

    handleRowEdit(row) {
      this.checkAbailable()
      this.$router.push({
        name: 'cloud-speed.router.configTemplates__edit__id',
        params: {
          id: row.id
        }
      })
    },

    handleRowBind(row) {
      this.checkAbailable()
      this.$refs.DialogBind.handleOpen(row)
    },

    async handleDelete() {
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(async() => {
        const params = {
          ids: this.selectionId
        }
        try {
          await this.Fetch.post('V4/cdntpl.delete', params)
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.handleSearch()
      })
    },

    formatTitle(key) {
      if (!KEY_MAP[key] || !this.moduleLabel['cloud-speed'].SETTINS_ITEM[KEY_MAP[key]]) return key
      return this.moduleLabel['cloud-speed'].SETTINS_ITEM[KEY_MAP[key]].title
    },

    formatResponse(response) {
      response.list.forEach(item => {
        item.domainsList = Object.values(item.domains)
        item.domainsId = Object.keys(item.domains)
        // TODO FK PHP
        Object.assign(item.detail.safe_snap, item.detail.mirror)
        const settingContent = []
        Object.keys(item.detail).forEach(key => {
          if (['web_honeypot_rules', 'mirror', 'resp_headers_rules', 'cdn_advance_cache_rules', 'customized_req_headers_rules'].includes(key)) return

          settingContent.push({
            title: this.formatTitle(key),
            name: KEY_MAP[key],
            data: item.detail[key]
          })
        })
        item.settingContent = settingContent
      })
      return response
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _.id)
    }
  }
}
</script>
