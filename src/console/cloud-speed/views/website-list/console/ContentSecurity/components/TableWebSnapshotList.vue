<template>
  <div :class="b()">
    <DmAlert>
      1. 快照指定时间白名单模式下仅白名单中的时间启用快照，指定时间黑名单仅黑名单中的时间不启用快照。<br>
      2. 区域白名单模式下仅白名单中的区域启用快照，黑名单模式仅黑名单中的区域不启用快照；支持按国家、省市维度进行区域访问控制配置。<br>
      3. 网站快照支持新增备份快照，可提前抓取备份快照并根据业务需要启用备份快照，为网站内容安全提供多重保障。<br>
      4. 新增备份快照为单次抓取任务，爬虫将根据备份内容配置抓取网站内容，备份支持预览功能。<br>
      <!-- 5. 删除URL”将同时删除替身和CND节点中的URL STORY-2021-->
    </DmAlert>
    <template v-if="!list.length">
      <el-button
        type="primary"
        @click="handleCreate"
      >设置网站快照</el-button>
    </template>
    <template v-else>
      <el-button
        :disabled="list.some(_ => Number(_.type) === 0)"
        type="primary"
        @click="handleCreate({type: 0})"
      >
        新增系统快照
      </el-button>
      <el-button
        type="primary"
        @click="handleCreate({type: 1})"
      >
        新增备份快照
      </el-button>
      <el-button
        :disabled="multipleActionDisable"
        @click="handleDeleteUrl"
      >
        删除URL
      </el-button>
    </template>
    <DmData
      v-show="list.length > 0"
      ref="DmData"
      :show-pagination="false"
      class="margin-top"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        border
      >
        <el-table
          :data="list"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" />
          <el-table-column
            prop="name"
            label="快照名称"
            min-width="180"
          >
            <template slot-scope="scope">
              <template v-if="Number(scope.row.type) === 0">
                {{ scope.row.name }}<br>
              </template>
              <ColumnFormInput
                v-else
                :value-view="scope.row.name"
                v-model="scope.row.name"
                :fetch-submit="value => fetchRowSubmit(value, 'name', scope.row)"
              />
              {{ scope.row.mirror_id }}
            </template>
          </el-table-column>
          <el-table-column
            prop="backup_size"
            label="备份大小"
            min-width="100"
          />
          <el-table-column
            label="选中状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.on_use"
                :active-value="1"
                :inactive-value="0"
                @change="val => handleUpdateUse(val, scope.row)"
              />
            </template>
          </el-table-column>
          <!-- 采取独家智能算法，每日定时抓取页面内容，若抓取失败，访客继续访问时，会再次抓取页面内容 -->
          <el-table-column
            label="更新间隔"
            min-width="180"
          >
            <template slot="header">
              更新间隔
              <el-tooltip
                class="item"
                effect="dark"
                content="采取独家智能算法，每日定时抓取页面内容，若抓取失败，访客继续访问时，会再次抓取页面内容 "
                placement="top"
              >
                <i
                  class="el-icon-warning"
                  style="margin-left:5px; font-size: 15px;"
                />
              </el-tooltip>
            </template>
            <template slot-scope="{row}">
              {{ selectRegularUpdate.find(i => i.value === Number(row.regular_update)) && selectRegularUpdate.find(i => i.value === Number(row.regular_update)).label || '' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="final_fetch_time"
            label="最后抓取时间"
            min-width="180"
          />
          <el-table-column
            prop="final_fetch_status_desc"
            label="最后抓取状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-popover
                :disabled="scope.row.final_fetch_status !== '30'"
                placement="top"
                width="150"
                trigger="hover"
              >
                请您先删除该域名，完成备案后，重新新增该域名！
                <span slot="reference">
                  {{ scope.row.final_fetch_status_desc }}
                </span>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="comment"
            label="备注"
            min-width="180"
          >
            <template slot-scope="scope">
              <ColumnFormInput
                :value-view="scope.row.comment"
                v-model="scope.row.comment"
                :fetch-submit="value => fetchRowSubmit(value, 'comment', scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="250"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  :disabled="scope.row.final_fetch_status === '30' || scope.row.final_fetch_status === '35'"
                  type="text"
                  @click="handleRowUpdate(scope)"
                >立即更新</el-button>
                <el-button
                  :disabled="scope.row.final_fetch_status === '30' || scope.row.final_fetch_status === '35'"
                  type="text"
                  @click="handleRowPreviews(scope)"
                >预览</el-button>
                <el-button
                  :disabled="scope.row.final_fetch_status === '30' || scope.row.final_fetch_status === '35'"
                  type="text"
                  @click="handleRowSetting(scope)"
                >配置</el-button>
                <el-button
                  type="text"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogUpdateSnapshot
      ref="DialogUpdateSnapshot"
      @init="fetchList"
    />
    <DialogSettingSnapshot
      ref="DialogSettingSnapshot"
      @init="fetchList"
    />
    <DialogWebSnapshot
      ref="DialogWebSnapshot"
      @init="fetchList"
    />
    <DialogDeleteUrl
      ref="DialogDeleteUrl"
      @init="fetchList"
    />
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import consoleData from '@/mixins/consoleData'
import domainMixins from '@/mixins/domain'
import ColumnFormInput from '@/components/Column/ColumnFormInput'
import DialogWebSnapshot from './DialogWebSnapshot'
import DialogUpdateSnapshot from './DialogUpdateSnapshot'
import DialogSettingSnapshot from './DialogSettingSnapshot'
import DialogDeleteUrl from './DialogDeleteUrl.vue'

export default create({
  props: {
    status: String
  },

  components: {
    DialogWebSnapshot,
    DialogUpdateSnapshot,
    DialogSettingSnapshot,
    DialogDeleteUrl,
    ColumnFormInput
  },

  mixins: [consoleData, domainMixins],

  data() {
    return {
      API_INDEX: 'V4/replaceMirror.mirror.list',
      bindParams: {},
      selectRegularUpdate: [
        {
          label: '12小时',
          value: 12
        },
        {
          label: '1天',
          value: 24
        },
        {
          label: '不更新',
          value: 0
        }
      ]
    }
  },

  created() {
    this.bindParams.domain = this.domainInfo.domain
  },

  methods: {
    async handleUpdateUse(status, row) {
      let message = status ? '确认选择' : '确认关闭'
      message += row.name + '?'
      this.$confirm(message, '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await this.Fetch.post('V4/replaceMirror.mirror.setOnUseMirror', {
            mirror_name: status ? row.name : '',
            domain: this.domainInfo.domain
          })
        } finally {
          this.fetchList()
        }
        this.Message('ACTION_SUCCESS')
      }).catch(() => {
        this.fetchList()
      })
    },

    getList() {
      return this.list
    },

    formatResponse(response) {
      this.$emit('update', response.list)
      return response
    },

    handleCreate(form = {}) {
      this.$refs.DialogWebSnapshot.handleOpen({
        domain: this.domainInfo.domain,
        ...form
      })
    },
    handleDeleteUrl() {
      const data = {
        'domain': this.$route.query.pageTitle,
        'url_list': [],
        'snapshot_list': this.multipleSelection.map(i => {
          return {
            mirror_id: i.mirror_id || '',
            type: i.type
          }
        })
      }
      this.$refs.DialogDeleteUrl.handleOpen({ ...data })
    },
    handleRowUpdate(scope) {
      const { row } = scope
      const { id, domain } = row
      const form = {
        id,
        domain
      }
      this.$refs.DialogUpdateSnapshot.handleOpen(form)
    },

    handleRowPreviews(scope) {
      const { row } = scope
      const { webcdn_protected_status, domain, protocol } = row
      const returnUrl = `${protocol}://${domain}/yundun_setcookies/?server=${domain}&cmd=view&backname=system&returnUrl=${domain}`

      if (webcdn_protected_status === 0) {
        window.open('https://www.yundun.com/html_source_view_service/?url=' + protocol + '://' + domain)
      } else {
        window.open(returnUrl)
      }
    },
    // 配置
    async handleRowSetting(scope) {
      const { id, domain } = scope.row
      const data = await this.Fetch.post('V4/replaceMirror.mirror.configureInfo', { id })
      const form = {
        id,
        domain,
        type: Number(scope.row.type),
        limit_js: Number(data.limit_js),
        backup_content: Number(data.backup_content),
        regular_update: Number(data.regular_update),
        initial_fetch_table: data.Initial_fetch_urls,
        has_remain: data.has_remain,
        comment: scope.row.comment,
        name: data.name,
        black_urls: data.blackList.map(_ => {
          return {
            url: _.url
          }
        })
      }
      this.$refs.DialogSettingSnapshot.handleOpen(form)
    },

    async fetchRowSubmit(value, name, row) {
      const form = {
        ...row,
        [name]: value
      }
      try {
        await this.Fetch.post('V4/replaceMirror.mirror.updateMirrorInfo', form)
      } catch (e) {
        throw new Error()
      } finally {
        this.fetchList()
      }
    },

    async handleDelete(row) {
      // await this.confirmAction()
      const params = {
        ids: [row.id]
      }
      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await this.Fetch.delete('V4/replaceMirror.mirror.del', params)
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    }
  }
})
</script>
