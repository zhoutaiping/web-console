<style lang="scss" scoped>
.card-business {
  padding-bottom: 0px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);

  &:hover {
    border-color: #c0c4cc;
  }

  &.is-open {
    border-color: #1894ee;
  }

  .yd-card__title {
    margin-bottom: 0px;
  }

  .dmTable {
    border-top: 1px solid #eee; // $--table-border-color;
    margin: 0px -12px;
  }
}
</style>

<template>
  <div>
    <yd-card
      v-for="item in BUSINESS_TYPE"
      v-show="!(readonly && form[item.value].length === 0)"
      :class="{'is-open': item.active}"
      :title="item.label"
      :key="item.value"
      class="card-business"
      style="margin-bottom: 12px"
      border
    >
      <el-switch
        v-show="!readonly"
        slot="action"
        v-model="item.active"
        @change="handleItemOp(item.value, item.active)"
      />
      <!-- TABLE -->
      <DmTable
        v-if="item.active"
        :open-min-height="false"
        :add-button="!readonly"
        type="white"
        @click-add-button="handleRowAdd(item.value)"
      >
        <el-table
          :data="form[item.value]"
          :expand-row-keys="expandList"
          row-key="package_id_uuid"
        >
          <el-table-column
            type="expand"
            width="1"
          >
            <template slot-scope="{row}">
              <div
                v-if="!!row.content_setting"
                style="padding: 0 16px"
              >
                <h3>
                  报告内容设置
                </h3>
                <ColumnForm
                  :ref="`table-${item.content_setting}`"
                  :rules="paramsItemRules"
                  :model="row"
                  prop="meal_name"
                >
                  <el-checkbox-group v-model="row.content_setting">
                    <el-checkbox
                      v-for="_i in Object.keys(Label.CONTENT_SETTING)"
                      :label="_i"
                      :key="_i"
                      :disabled="_i === 'overview'"
                    >
                      {{ Label.CONTENT_SETTING[_i] }}
                    </el-checkbox>
                  </el-checkbox-group>
                </ColumnForm>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="名称"
            min-width="220"
          >
            <template slot-scope="scope">
              <template v-if="readonly">
                {{ scope.row.meal_name }}
              </template>
              <ColumnForm
                v-else
                :ref="`table-${item.value}`"
                :rules="paramsItemRules"
                :model="scope.row"
                prop="meal_name"
              >
                <el-input v-model="scope.row.meal_name" />
              </ColumnForm>
            </template>
          </el-table-column>
          <el-table-column
            v-if="item.value === 'hwws' || item.value==='tjkd'"
            label="服务套餐"
            width="220"
          >
            <template slot-scope="scope">
              <template v-if="readonly">
                {{ scope.row.package_id | labelView(packages[item.value]) }}
              </template>
              <ColumnForm
                v-else
                :ref="`table-${item.value}`"
                :rules="paramsItemRules"
                :model="scope.row"
                prop="package_id"
              >
                <yd-form-select
                  :disabled="item.value === 'webaqjs'"
                  v-model="scope.row.package_id"
                  :selects="packages[item.value]"
                  placeholder="服务套餐"
                />
              </ColumnForm>
            </template>
          </el-table-column>
          <el-table-column
            v-if="item.value === 'webaqjs' || item.value === 'hwws'"
            label="服务内容"
            min-width="220"
          >
            <template slot-scope="scope">
              <template v-if="readonly">
                {{ scope.row.domain_list.join(', ') }}
              </template>
              <ColumnForm
                v-else
                :ref="`table-${item.value}`"
                :rules="paramsItemRules"
                :model="scope.row"
                prop="domain_list"
              >
                <template v-if="item.value === 'webaqjs'">
                  <SelectMultiple
                    v-model="scope.row.domain_list"
                    :checks="domainList"
                    :default-check="false"
                    width="100%"
                    text-submit="确认"
                  />
                </template>
                <template v-else>
                  <SelectMultiple
                    v-model="scope.row.domain_list"
                    :checks="formatHwwsDomain(scope.row.package_id)"
                    width="100%"
                    text-submit="确认"
                  />
                </template>
              </ColumnForm>
            </template>
          </el-table-column>
          <el-table-column
            v-if="!readonly"
            width="50"
            label="操作"
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="form[item.value].length === 1 && scope.$index === 0"
                type="text"
                @click="handleRowDelete(form[item.value], scope.$index)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </yd-card>
  </div>
</template>

<script>
import create from '@/utils/create-basic'
import Fetch from '@/api/fetch'
import { deepClone } from '@/utils'
// import { isExpire } from '@/utils/time'
import { formatLabel } from '@/utils/form'
import DmTable from '@/components/Dm/DmTable'
import SelectMultiple from '@/components/Select/SelectMultiple'
import ColumnForm from '@/components/Column/ColumnForm'
import Label from '../constants/label'
import { getUserstore, rmUserstore } from '@/utils/auth'
const PARAMS_ITEM = {
  key: '',
  meal_name: '',
  domain_list: [],
  package_id: ''
}

function guid2() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}
export default create({
  name: 'formReportList',

  components: { DmTable, SelectMultiple, ColumnForm },

  props: {
    value: {},
    readonly: Boolean
  },

  data() {
    return {
      Label,
      form: this.value,
      indexMap: {}, // 名称自增数
      packages: { // 套餐集合
        // hwws: [],
        tjkd: []
      },
      hwwsList: [],
      domainList: [],
      BUSINESS_TYPE: [],
      paramsItemRules: {
        meal_name: [
          { required: true, trigger: 'blur', message: ' ' }
        ],
        package_id: [
          { required: true, trigger: 'change', message: ' ' }
        ],
        domain_list: [
          { type: 'array', required: true, trigger: 'change', message: ' ' }
        ],
        content_setting: []
      },

      default_content_setting: (data = {}) => {
        const val = []
        Object.keys(data).forEach(i => {
          if (data[i] === true) val.push(i)
        })
        return val
      }
    }
  },
  computed: {
    expandList() {
      const webaqjs = deepClone(this.form['webaqjs']) || []
      return webaqjs.map(i => i.package_id_uuid)
    }
  },
  watch: {
    value(val) {
      this.form = val
      this.init()
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      const form = deepClone(this.form)
      this.initPackges()

      if (Object.keys(form).length === 0) {
        this.form = {
          tjkd: [],
          webaqjs: []
          // hwws: []
        }
        this.initItem()
      } else {
        this.formatRes(form)
      }
    },

    formatHwwsDomain(id) {
      if (!id) return []
      const { bind_domain_list = [] } = this.hwwsList.find(_ => _.id === id)
      const list = []
      Object.keys(bind_domain_list).forEach(key => {
        list.push({
          label: bind_domain_list[key],
          value: bind_domain_list[key]
        })
      })
      return list
    },

    formatRes(form) {
      const { userType } = getUserstore()
      const BUSINESS_TYPE = userType === 'child' ? deepClone(Label.BUSINESS_TYPE_CHILD) : deepClone(Label.BUSINESS_TYPE)

      BUSINESS_TYPE.forEach(item => {
        item.active = false
      })
      Object.keys(form).forEach(key => {
        const item = form[key]
        const list = []
        // 对象转数组，key保留
        Object.keys(item).forEach(key => {
          const _item = item[key]
          if (key.match(RegExp('webaqjs'))) {
            _item.package_id_uuid = guid2()
            _item.content_setting = this.default_content_setting(_item.content_setting)
          }
          list.push({
            key,
            ..._item
          })
        })
        form[key] = list
        if (BUSINESS_TYPE.find(_ => _.value === key)) BUSINESS_TYPE.find(_ => _.value === key).active = !!list.length
      })
      this.BUSINESS_TYPE = BUSINESS_TYPE
      this.form = form
    },

    async initPackges() {
      const data = await Fetch.post('V4/member.report.getMealList')
      const {
        // hwws,
        tjkd,
        webaqjs } = data

      // const packagesHwws = hwws.list.map(item => {
      //   return {
      //     label: item.plan_diy_name,
      //     value: item.id,
      //     disabled: item.domainList.length === 0 || isExpire(item.expire_time)
      //   }
      // })

      // this.packages.hwws = packagesHwws.filter(_ => !_.disabled)
      this.packages.tjkd = formatLabel(tjkd, 'package_name', 'id')

      // this.hwwsList = hwws.list
      this.domainList = formatLabel(webaqjs.list)
    },

    initItem() {
      const { userType } = getUserstore()
      const BUSINESS_TYPE = userType === 'child' ? deepClone(Label.BUSINESS_TYPE_CHILD) : deepClone(Label.BUSINESS_TYPE)
      BUSINESS_TYPE.forEach(item => {
        item.active = false
      })
      this.BUSINESS_TYPE = BUSINESS_TYPE
      Object.keys(this.form).forEach(key => {
        this.resetItem(key)
      })
    },

    handleItemOp(key, active) {
      this.resetItem(key)
      if (active) this.handleRowAdd(key)
    },

    resetItem(key) {
      this.form[key] = []
      this.indexMap[key] = 0
    },

    handleRowDelete(list, index) {
      list.splice(index, 1)
    },

    handleRowAdd(key) {
      const form = this.form
      const num = ++this.indexMap[key]
      const item = deepClone(PARAMS_ITEM)
      const keyItem = Label.BUSINESS_TYPE.find(_ => _.value === key).label
      item.meal_name = `${keyItem}-${num}`
      if (key === 'webaqjs') {
        item.package_id_uuid = guid2()
        item.content_setting = ['overview', 'cdn', 'waf', 'cc']
      }
      if (this.checkItem(key)) form[key].push(item)
    },

    checkItem(key) {
      const refs = this.$refs[`table-${key}`]
      if (refs && !refs.every(_ => _.validate())) {
        return false
      } else {
        return true
      }
    },

    checkForm() {
      // 判断是否已有一条数据
      if (!Label.BUSINESS_TYPE.some(_ => this.form[_.value].length > 0)) {
        this.$message.warning('请至少添加一条报告内容')
        return false
      }
      return Label.BUSINESS_TYPE.every(_ => this.checkItem(_.value))
    },

    getForm() {
      const params = deepClone(this.form)
      const setting = deepClone(Label.CONTENT_SETTING)
      const data = {}
      Object.keys(params).forEach(key => {
        data[key] = {}
        const item = params[key]
        item.forEach((item, index) => {
          if (key === 'webaqjs') {
            const content_setting = {}
            Object.keys(setting).forEach(_i => {
              content_setting[_i] = item.content_setting ? item.content_setting.includes(_i) : true
            })
            item.content_setting = content_setting
          }
          delete item.key
          data[key][key + index] = item
        })
      })

      return data
    }
  }
})
</script>
