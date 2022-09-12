<style lang="scss">
.pagePatchSetting {
  .listSetting {
    margin-left: 42px;
  }
  .yd-table .el-table {
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
  }
  .el-table td,
  .el-table th.is-leaf {
    border-bottom: none;
  }
  .yd-table .el-table td {
    padding: 6px 0;
  }
  .el-table th div {
    font-weight: 500;
  }
}
</style>

<template>
  <ConsolePageLayout>
    <div :class="b()">
      <DmCard>
        <yd-form-radio-button
          :radios="typeSelect"
          :value="batchSelectType"
          style="margin-bottom: 12px"
          @change="SET_SELECT_TYPE"
        />
        <div v-show="batchSelectType === 'group'">
          <DmCard grey>
            <el-form label-width="100px">
              <el-form-item label="选择分组">
                <yd-form-select
                  v-model="form.group_id"
                  :selects="selectGroup"
                  filterable
                  style="margin-right: 10px"
                  @change="handleSelectGroup"
                />
                <GroupInfo
                  v-show="form.group_id"
                  ref="GroupInfo"
                  :info="groupInfo"
                />
              </el-form-item>
            </el-form>
          </DmCard>
        </div>
        <div v-show="batchSelectType === 'custom'">
          <CardSelect
            ref="batchSelect"
            v-model="selects"
            :loading="loadingDomain"
            :show-more="showMore"
            :checks="listDomain"
            @more="fetchDomainMore"
            @change="handleSelectsChange"
            @search="handleSelectSearch"
          />
        </div>
      </DmCard>
      <DmCard
        v-for="(item, index) in MENU"
        :title="item.title"
        :key="index"
        class="margin-top"
      >
        <DmTable type="white">
          <el-table :data="item.list">
            <el-table-column
              width="180"
              prop="title"
              label="配置项"
            />
            <el-table-column label="描述">
              <template slot-scope="scope">
                {{ scope.row.desc | envView }}
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  :disabled="scope.row.name === '访问控制 - 黑名单' && haveWAF || scope.row.name === '域名节点状态' && haveCheck"
                  @click="handleOpenSetting(scope.row)"
                >修改配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </DmTable>
      </DmCard>
    </div>
    <!-- 弹框 -->
    <DialogSource
      ref="dialogSource"
      @submit="handleSettingUpdate"
    />
    <DialogRequestTime
      ref="dialogRequestTime"
      @submit="handleSettingUpdate"
    />
    <DialogHealthy
      ref="dialogHealthy"
      @submit="handleSettingUpdate"
    />
    <DialogKeepLive
      ref="dialogKeepLive"
      @submit="handleSettingUpdate"
    />
    <!--  -->
    <DialogBatchSetting
      ref="DialogBatchSetting"
      @submit="handleSettingUpdate"
    />
    <DialogConfirm
      ref="dialogConfirm"
      @confirm="handleConfirmSubmit"
    />
  </ConsolePageLayout>
</template>

<script>
import lockr from 'lockr'
import create from '@/utils/create-basic'
import CardSelect from '@/components/Card/CardSelect'
import ListSetting from '@/components/List/ListSetting'
import ListSettingItem from '@/components/List/ListSettingItem'
import MENU from '../../../constant/batch-menu'
import settingsConfig from '../../../constant/settingsConfig'
import dialogBatch from '../../../mixins/dialog-batch'
import GroupInfo from './components/GroupInfo'
import DialogSource from './components/DialogSource'
import DialogRequestTime from './components/DialogRequestTime'
import DialogHealthy from './components/DialogHealthy'
import DialogKeepLive from './components/DialogKeepLive'
import DialogBatchSetting from '../../../components/DialogBatchSetting'
import DialogConfirm from '../../../components/DialogConfirm'
import { getUserstore } from '@/utils/auth'
export default create({
  name: 'pagePatchSetting',

  mixins: [dialogBatch],

  components: {
    CardSelect,
    ListSetting,
    ListSettingItem,
    GroupInfo,
    DialogBatchSetting,
    DialogConfirm,
    DialogSource,
    DialogRequestTime,
    DialogHealthy,
    DialogKeepLive
  },

  data() {
    const { userType } = getUserstore()
    const isChild = userType === 'child'
    return {
      MENU: [],
      selectGroup: [],
      groupInfo: {},
      typeSelect: isChild ? [
        {
          label: '手动选择',
          value: 'custom'
        }] : [
        {
          label: '手动选择',
          value: 'custom'
        },
        {
          label: '按组选择',
          value: 'group'
        }
      ],
      filters: [
        {
          label: '已迁徙',
          value: 1
        },
        {
          label: '未迁徙',
          value: 2
        }
      ],
      form: {
        group_id: ''
      },
      showMore: false,
      selects: [],
      listDomain: [],
      loadingDomain: true,
      dialogName: '',
      formConfirm: null
    }
  },

  mounted() {
    const { groupId } = this.$route.query
    if (groupId) {
      this.form.group_id = groupId
      this.SET_SELECT_TYPE('group')
      this.handleSelectGroup(groupId)
    } else {
      this.SET_SELECT_TYPE('custom')
      const domainList = lockr.get('batch-domains')
      if (domainList) {
        this.listDomain = domainList
        this.selects = domainList.map(_ => _.value)
        this.SET_DOMAIN_SELECTS_ID(domainList.map(_ => _.value))
        this.SET_DOMAIN_SELECTS_LIST(domainList)
      }
    }

    this.fetchDomainInfo()
    this.domainListInfo()
    this.fetchGroupList()
    this.formatMenu()
  },

  methods: {
    formatMenu() {
      MENU.forEach(item => {
        item.list = item.list.map(iItem => {
          if (typeof iItem === 'string') {
            return {
              name: iItem,
              ...this.moduleLabel['cloud-speed'].SETTINS_ITEM[iItem],
              ...settingsConfig[iItem]
            }
          } else {
            return iItem
          }
        })
      })
      this.MENU = MENU
    },

    async handleSelectGroup(group_id) {
      this.SET_GROUP_ID(group_id)
      this.domainListInfo()
      this.$nextTick(() => {
        this.$refs.GroupInfo.fetchData(group_id)
      })
    },

    async fetchGroupList() {
      const data = await this.Fetch.get('/V4/web.domain.group.list', { per_page: 1000 })
      this.selectGroup = data.list.map(_ => {
        return {
          label: _.group_name,
          value: _.id
        }
      })
    },

    handleSelectsChange(data) {
      this.SET_DOMAIN_SELECTS_ID(data.map(_ => _.value))
      this.SET_DOMAIN_SELECTS_LIST(data)
      this.domainListInfo()
      lockr.set('batch-domains', data)
    },

    handleOpenSetting(row) {
      if (this.$refs[row.name]) {
        this.$refs[row.name].handleOpen()
      } else {
        // 新版弹框
        const options = {
          ...row
        }
        if (this.batchSelectType === 'custom') {
          options.domain_ids = this.selects
        } else {
          options.group_id = this.form.group_id
        }
        this.$refs.DialogBatchSetting.handleOpen({
        }, {
          ...options,
          domains: this.selectsList.map(_ => _.label)
        })
      }
    },

    handleSelectSearch(domain) {
      this.fetchDomainInfo({ domain })
    },
    // 读取域名
    async fetchDomainInfo(options = {}) {
      const { domain = '', page = 0, more } = options
      this.loadingDomain = true
      const params = {
        per_page: 1000,
        domain,
        page
      }
      const data = await this.Fetch.get('V4/web.domain.list.short', params)
      const list = data.list.map(item => {
        return {
          label: item.domain,
          value: item.id,
          filters: {},
          disabled: item.check_status === '3' || item.check_status === '5' || item.check_status === '6' || item.check_status === '7'
        }
      })
      this.showMore = Number(list.length) !== 0
      this.loadingDomain = false
      this.listDomain = more ? this.listDomain.concat(list) : list
      this.$nextTick(() => {
        this.$refs.batchSelect && this.$refs.batchSelect.handleChange()
      })
    },

    fetchDomainMore({ keyword, page }) {
      this.fetchDomainInfo({ domain: keyword, page, more: true })
    },

    async handleConfirmSubmit() {
      try {
        await this.fetchSubmit(this.formConfirm)
      } catch (e) {
        return
      }

      const dialog = this.$refs[this.dialogName]
      this.Message('TASK_SUBMIT')
      dialog.handleClose()
    },

    async fetchSubmit(update) {
      try {
        await this.Fetch.post('V4/Web.Domain.batch.set.update', update)
      } catch (e) {
        if (e.status.code && e.status.code === 100200) {
          this.$refs.dialogConfirm.handleOpen()
          this.formConfirm = {
            ...update,
            confirm: 1
          }
        }
        throw new Error()
      }
    },

    // 提交批量编辑
    async handleSettingUpdate(data) {
      const { name, id, form } = data
      this.dialogName = name
      const update = {
        confirm: 0
      }

      if (this.batchSelectType === 'custom') {
        if (!this.selects.length) {
          this.$message.warning('请选择域名!')
          throw Error()
        }
        update.domain_ids = this.selects
      } else {
        if (!this.form.group_id) {
          this.$message.warning('请选择分组!')
          throw Error()
        }
        update.group_id = this.form.group_id
      }

      if (id === '__RAW__') {
        Object.assign(update, form)
      } else {
        update[id] = form
      }

      const dialog = this.$refs[name]
      try {
        dialog.loadingSubmit = true
        await this.fetchSubmit(update)
      } catch (e) {
        return
      } finally {
        dialog.loadingSubmit = false
      }

      this.Message('TASK_SUBMIT')
      dialog.handleClose()
    }
  }
})
</script>
