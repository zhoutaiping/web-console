<style lang="scss">
.PagesPrivilegesDetail {
  .el-tabs__item {
    padding: 0 16px;
    height: 38px;
    line-height: 38px;
    font-size: 13px;
  }
}
</style>

<template>
  <div class="PagesPrivilegesDetail">
    <DmCard
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(255, 255, 255, 0.8)"
    >
      <el-form
        ref="Form"
        :model="form"
        :rules="rules"
        label-position="top"
      >
        <el-form-item
          label="策略名称"
          prop="strategy_name"
        >
          <el-input
            v-model="form.strategy_name"
            style="width: 500px"
            placeholder="策略名称"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            :rows="4"
            v-model="form.desc"
            type="textarea"
            style="width: 500px"
            placeholder="描述"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="$refs.DialogModules.handleOpen({selectModules})"
          >选择策略模块</el-button>
        </el-form-item>
        <el-tabs
          v-model="editableTabsValue"
          type="card"
          closable
          @tab-remove="removeTab"
        >
          <el-tab-pane
            v-for="(item, index) in selectSettingsTabs"
            :key="index"
            :label="item.label"
            :name="item.name"
          >
            <DmTable
              :loading="loading"
              border
              min-height
            >
              <el-table :data="form.statement[editableTabsValue]">
                <el-table-column
                  label="授权操作"
                  prop="group_name"
                  min-width="120"
                />
                <el-table-column
                  label="描述"
                  prop="acl_note"
                  min-width="120"
                >
                  <template slot-scope="scope">
                    {{ scope.row.acl_note }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否启用"
                  align="left"
                  min-width="80"
                >
                  <template slot-scope="scope">
                    <el-switch
                      v-model="scope.row.enable"
                      active-value="1"
                      inactive-value="0"
                    />
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  label="授权对象"
                  min-width="250"
                >
                  <template slot-scope="scope">
                    <template v-if="scope.row.enable === '1' && scope.row.is_setting">
                      <a @click="handleOpenResource(scope.row, scope.$index)">
                        <template v-if="scope.row.resource[0] === 'all'">
                          全部对象
                        </template>
                        <template v-else>
                          <template v-if="scope.row.resource.length > 0">
                            <ColumnListMore :value="scope.row.resourceView" />
                          </template>
                          <template v-else>
                            选择授权对象
                          </template>
                        </template>
                      </a>
                    </template>
                    <template v-else>
                      无
                    </template>
                  </template>
                </el-table-column> -->
                <el-table-column
                  label="授权效力"
                  min-width="150"
                >
                  <template slot-scope="scope">
                    <yd-form-radio
                      :disabled="scope.row.enable === '0'"
                      v-model="scope.row.effect"
                      :radios="RADIOS_EFFECT"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </DmTable>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div style="margin-top: 32px">
        <el-button
          :loading="submitLoading"
          size="medium"
          type="primary"
          style="margin-right: 12px"
          @click="handleSubmit"
        >保存</el-button>
        <router-link
          :to="{
            name: 'access-management.router.privileges__custom'
        }">
          <el-button size="medium">取消</el-button>
        </router-link>
      </div>
    </DmCard>
    <DialogModules
      ref="DialogModules"
      @submit="changeModules"
    />
    <DialogResource
      ref="DialogResource"
      @submit="handleSubmitResource"
    />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { arrRemove } from '@/utils/array'
import SelectMultiple from '@/components/Select/SelectMultiple'
import ColumnForm from '@/components/Column/ColumnForm'
import ColumnList from '@/components/Column/ColumnList'
import SelectTransfer from '@/components/Select/SelectTransfer'
import ColumnListMore from '@/components/Column/ColumnListMore'
import accessMixins from '../../../mixins/access'
import DialogModules from '../components/DialogModules'
import DialogResource from '../components/DialogResource'

export default {
  components: { SelectMultiple, DialogModules, ColumnForm, ColumnList, ColumnListMore, SelectTransfer, DialogResource },

  mixins: [accessMixins],

  data() {
    return {
      loading: true,
      id: this.$route.params.id,
      RADIOS_EFFECT: [
        {
          label: '允许',
          value: 'allow'
        },
        {
          label: '禁止',
          value: 'deny'
        }
      ],
      moduleMap: {},
      submitLoading: false,
      editableTabsValue: '2',
      selectModules: [],
      rules: {
        strategy_name: {
          type: 'string',
          required: true,
          trigger: 'blur',
          message: '请填写策略名称'
        }
      },
      tableRules: {
        resource: {
          type: 'array',
          required: true,
          trigger: 'blur',
          message: ' '
        }
      },
      form: {
        strategy_name: '',
        desc: '',
        group_ids: [],
        statement: {}
      }
    }
  },

  computed: {
    selectSettingsTabs() {
      return this.settingTabs.filter(_ => this.selectModules.includes(_.value))
    }
  },

  created() {
    this.init()
  },

  methods: {
    async formatResourceView(row) {
      if (row.resource.length === 0) return

      if (!row.setting_type) return
      const data = await this.Fetch.get(`V4/${row.setting_type}`, { per_page: 10000 })
      const map = {}

      const keyName = Object.keys(row.setting_list)[0]
      const valueName = Object.values(row.setting_list)[0]

      data.list.forEach(item => {
        map[item[valueName]] = item[keyName]
      })

      return row.resource.map(_ => map[Number(_)])
    },

    async init() {
      this.fetchGroup()
      await this.initSettings()
      // await this.initModuleMap()
      // 读取组织
      if (this.id) await this.fetchInfo()
      this.loading = false
    },

    async initModuleMap() {
      const map = {}
      const data = await this.Fetch.get('V4/permission.get.permissionModuleNames')

      Object.keys(data.module).forEach(key => {
        const item = data.module[key]
        Object.keys(item).forEach(cKey => {
          const cItem = item[cKey]
          map[cKey] = cItem
        })
      })
      this.moduleMap = map
    },

    async initSettings() {
      await this.fetchSettingList()
      const settingList = deepClone(this.settingList)

      // 初始化配置显示
      Object.keys(settingList).forEach(key => {
        this.form.statement[key] = settingList[key].map((item, index) => {
          return {
            index,
            name: key,
            group_name: item.group_name,
            setting_type: item.setting_type,
            setting_list: item.setting_list,
            note: item.note,
            is_setting: Number(item.is_setting) === 1,
            id: item.id,
            effect: 'allow',
            resource: [],
            condition: '',
            enable: '0'
          }
        })
      })
    },

    async fetchInfo() {
      const data = await this.Fetch.get('V4/permission.get.strategy', { id: this.id })
      this.form.strategy_name = data.strategy_name
      this.form.desc = data.desc
      this.form.group_ids = data.group_list.map(_ => _.id)

      if (data.strategy_info instanceof Object) {
        delete data.strategy_info.version
        for (const key in data.strategy_info) {
          await this.formatStatementList(data.strategy_info[key])
        }

        Object.keys(this.form.statement).forEach(key => {
          const list = this.form.statement[key]
          const listData = data.strategy_info[key]
          if (!listData) return

          list.forEach(item => {
            const itemData = listData.find(_ => _.id === item.id)
            Object.assign(item, itemData)
          })
        })

        this.selectModules = Object.keys(data.strategy_info)
        this.editableTabsValue = this.selectModules[0]
      }
    },

    async formatStatementList(list) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        item.resourceView = await this.formatResourceView(item)
      }
    },

    checkItem(key) {
      const refs = this.$refs[`table-${key}`]
      if (refs && !refs.every(_ => _.validate())) {
        return false
      } else {
        return true
      }
    },

    formatStatement(data) {
      const nData = {}

      Object.keys(data).forEach(key => {
        const row = data[key]
        if (this.selectModules.includes(key)) {
          nData[key] = row
        }
      })
      return nData
    },

    handleOpenResource(row) {
      this.$refs.DialogResource.handleOpen(row)
    },

    handleSubmitResource(row) {
      const { name, resource, resourceView, index } = row

      const item = this.form.statement[name][index]
      item.resource = resource
      item.resourceView = resourceView
    },

    async handleSubmit() {
      const form = { ...this.form }
      form.statement = this.formatStatement(form.statement)

      this.$refs.Form.validate(async(valid) => {
        if (!valid) return

        try {
          this.loading = true
          if (this.id) {
            form.id = this.id
            await this.Fetch.put('V4/permission.edit.strategy', form)
          } else {
            await this.Fetch.post('V4/permission.add.strategy', form)
          }
        } catch (e) {
          return
        } finally {
          this.loading = false
        }
        this.Message('ACTION_SUCCESS')
        setTimeout(() => {
          this.$router.push({
            name: 'access-management.router.privileges__custom'
          })
        }, 500)
      })
    },

    changeModules({ selectModules }) {
      this.selectModules = selectModules
      this.$nextTick(() => {
        this.editableTabsValue = this.selectModules.length > 0 ? this.selectModules[0] : ''
      })
    },

    removeTab(item) {
      this.$confirm('确认删除？', '提示', {
        type: 'warning'
      }).then(() => {
        arrRemove(this.selectModules, item)
        if (this.editableTabsValue === item) {
          this.editableTabsValue = this.selectModules.length > 0 ? this.selectModules[0] : ''
        }
      })
    }
  }
}
</script>
