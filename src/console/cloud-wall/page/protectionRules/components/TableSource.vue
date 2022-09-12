<template>
  <div>
    <DmTable
      border
      add-button
      @click-add-button="handleRowAdd"
    >
      <el-table :data="list">
        <el-table-column
          :label="sourceType === 1 ? 'IP' : '域名'"
          min-width="180"
        >
          <template slot-scope="scope">
            <ColumnForm
              :model="scope.row"
              :item-rules="sourceType === 1 ? rowRules.ip : rowRules.url"
              :ref="`value-${scope.$index}`"
              prop="value"
            >
              <template v-if="sourceType === 1">
                <el-input
                  v-model="scope.row.value"
                  placeholder="0.0.0.0"
                />
              </template>
              <template v-else>
                <el-input
                  v-model="scope.row.value"
                  placeholder="www.demo.com"
                />
              </template>
            </ColumnForm>
          </template>
        </el-table-column>
        <el-table-column
          v-if="portVisible"
          label="端口"
          min-width="100"
        >
          <template slot-scope="scope">
            <ColumnForm
              :model="scope.row"
              :rules="rowRules"
              :ref="`port-${scope.$index}`"
              prop="port"
            >
              <el-input
                v-model="scope.row.port"
                placeholder="端口"
              />
            </ColumnForm>
          </template>
        </el-table-column>
        <el-table-column
          label="线路"
          width="120"
        >
          <template slot-scope="scope">
            <yd-form-select
              v-model="scope.row.view"
              :selects="Label.IP_VIEW"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="right"
          label="操作"
          width="80"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleRowDelete(scope.$index)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </div>
</template>

<script>
import consoleTable from '@/mixins/consoleTable'
import RULE from '@/utils/verify'
import ColumnForm from '@/components/Column/ColumnForm'
import { validator } from '@/utils/form'

function ipVaildate(rule, value, callback) {
  if (RULE.ipReg.test(value)) {
    if (value === '0.0.0.0') callback(new Error(' '))
  } else {
    callback(new Error(' '))
  }
  callback()
}

export default {
  components: { ColumnForm },

  mixins: [consoleTable],

  props: {
    value: Array,
    sourceType: Number,
    portVisible: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      Label: {
        IP_VIEW: [
          {
            label: '主线路',
            value: 'primary'
          },
          {
            label: '备线路',
            value: 'backup'
          }
        ]
      },
      selectList: [],
      rowKey: ['value', 'port'],
      row: {
        value: '',
        port: '',
        view: 'primary'
      },
      rowRules: {
        ip: [
          { validator: ipVaildate }
        ],
        url: [
          { validator: validator(RULE.domain, ' ') }
        ],
        port: [
          { validator: validator(RULE.port, ' ') }
        ]
      }
    }
  },

  watch: {
    value(val) {
      this.clearValidate()
      this.list = val
    },

    list(val) {
      this.$emit('input', val)
    }
  },

  mounted() {
    this.list = this.value
  },

  methods: {
    async getList() {
      await this.handleCheckList()
      return this.list
    }
  }
}
</script>
