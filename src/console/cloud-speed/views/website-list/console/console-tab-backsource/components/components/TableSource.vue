<template>
  <DmTable
    add-button
    border
    @click-add-button="handleRowAdd"
  >
    <el-table :data="list">
      <el-table-column
        :label="back_source_type === 0 ? 'IP' : '域名'"
        min-width="180"
      >
        <template slot-scope="scope">
          <ColumnForm
            :model="scope.row"
            :item-rules="back_source_type === 0 ? rowRules.ip : rowRules.url"
            :ref="`value-${scope.$index}`"
            prop="value"
          >
            <template v-if="back_source_type === 0">
              <el-input
                v-model="scope.row.value"
                placeholder="支持IPv4、IPv6格式"
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
            :selects="moduleLabel['cloud-speed'].IP_VIEW"
          />
        </template>
      </el-table-column>
      <el-table-column
        v-if="back_source_type === 0"
        label="权重"
        width="140"
      >
        <template slot-scope="scope">
          <el-input-number
            v-model="scope.row.priority"
            :min="1"
            :max="100"
            controls-position="right"
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
</template>

<script>
import consoleTable from '@/mixins/consoleTable'
import RULE from '@/utils/verify'
import ColumnForm from '@/components/Column/ColumnForm'
import { validator } from '@/utils/form'

function ipVaildate(rule, value, callback) {
  value = value.replace(/(^\s*)|(\s*$)/g, '')
  if (RULE.ipReg.test(value) || RULE.Ipv6Reg.test(value)) {
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
    back_source_type: Number,
    portVisible: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      selectList: [],
      rowKey: ['value', 'port'],
      row: {
        value: '',
        port: '',
        view: 'primary',
        priority: 1
      },
      rowRules: {
        ip: { validator: ipVaildate },
        url: { validator: validator(RULE.domain, ' ') },
        port: { validator: validator(RULE.port, ' ') }
      }
    }
  },

  watch: {
    back_source_type(val) {
      this.list = [{
        value: '',
        port: '',
        view: 'primary',
        mx: 1
      }]
    },

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
