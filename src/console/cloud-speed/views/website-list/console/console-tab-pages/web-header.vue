<template>
  <yd-card
    horizontal
    title="自定义HTTP响应头"
  >
    <SelectSwitch
      slot="action"
      v-model="form.status"
      on-value="on"
      off-value="off"
      @change="fetchUpdate()"
    />
    <template slot="tips">支持您自定义 HTTP 响应头中的 header 信息</template>
    <DmTable
      :loading="loading"
      border
      add-button
      @click-add-button="handleAdd"
    >
      <el-table :data="list">
        <el-table-column
          width="300"
          label="类型"
        >
          <template slot-scope="scope">
            <template v-if="scope.row.$edit">
              <yd-form-select
                v-model="scope.row.typeRaw"
                :selects="HEADER_LIST"
                :style="{ width: scope.row.typeRaw === 'custom' ? '100px' : '100%'}"
                @change="value => handleChangeTypeRaw(value, scope.row)"
              />
              <el-input
                v-if="scope.row.typeRaw === 'custom'"
                v-model="scope.row.type"
                placeholder="请输入响应头名称"
                style="width: 170px; display: inline-block; margin-left: 8px"
              />
            </template>
            <p v-else>{{ scope.row.type }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="匹配内容（多个之间以 ',' 隔开）"
          prop="content"
          min-width="200"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.$edit"
              v-model="scope.row.content"
              :placeholder="scope.row.typeRaw | labelView(HEADER_LIST, 'tips', '')"
            />
            <p v-else>{{ scope.row.content || '未填写' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          min-width="150"
          label="备注"
          prop="remark"
        >
          <template slot-scope="scope">
            <el-input
              v-if="scope.row.$edit"
              v-model="scope.row.remark"
              placeholder="备注"
            />
            <p v-else>{{ scope.row.remark || '-' }}</p>
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          align="right"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.$edit"
              type="text"
              @click="handleCancle(scope.row, scope.$index)"
            >取消</el-button>
            <el-button
              v-else
              type="text"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-divider direction="vertical"/>
            <el-button
              v-if="scope.row.$edit"
              type="text"
              @click="handleSave(scope.row)"
            >保存</el-button>
            <el-button
              v-else
              type="text"
              @click="handleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
  </yd-card>
</template>

<script>
import SelectSwitch from '@/components/Select/SelectSwitch'
import Form from '@/service/form'
import panelMixins from '../panelMixins'
import SELECT from '../../../../constant/select'

const FORM_HEADER_RULES = {
  type: [
    { required: true, trigger: 'blur', message: '请选择类型' }
  ],
  content: [
    { required: true, trigger: 'blur', message: '请填写' }
  ]
}

const FORM_HEADER = {
  type: '',
  content: '',
  remark: ''
}

export default {
  components: { SelectSwitch },

  mixins: [panelMixins],

  data() {
    return {
      SETTING_ID: 'resp_headers',
      dialogDelete: [],
      FORM_HEADER_RULES,
      formHeader: new Form(FORM_HEADER, FORM_HEADER_RULES),
      HEADER_LIST: SELECT.HEADER_LIST,
      list: [],
      loading: true,
      formDefault: {
        status: 'off'
      }
    }
  },

  mounted() {
    this.init()
  },

  methods: {
    handleChangeTypeRaw(value, row) {
      row.type = value === 'custom' ? '' : value
    },

    async init() {
      this.loading = true
      const data = await this.Fetch.get('V4/web.domain.set.get.rule', {
        domain_id: this.domainId,
        group: 'resp_headers'
      })
      const { list = [] } = data.resp_headers

      list.forEach(item => {
        item = Object.assign(item, item.value)
        item.typeRaw = SELECT.HEADER_LIST.map(_ => _.value).includes(item.type) ? item.type : 'custom'
        item.$edit = false
      })

      this.list = list
      this.loading = false
    },

    handleCancle(row, index) {
      const { id } = row
      if (id) {
        row.$edit = false
      } else {
        this.list.splice(index, 1)
      }
    },

    async handleEdit(row) {
      await this.confirmAction()
      row.$edit = true
    },

    async handleSave(row) {
      const { type, content, remark, id } = row

      await this.Fetch.post('V4/web.domain.set.save.rule', {
        domain_id: this.domainId,
        group: {
          resp_headers: {
            type,
            content,
            remark,
            id
          }
        }
      })

      this.Message('ACTION_SUCCESS')
      row.$edit = false
      this.init()
    },

    async handleDelete(row) {
      await this.confirmAction()
      const { id } = row

      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.delete('V4/web.domain.set.del.rule', {
            domain_id: this.domainId,
            group: {
              resp_headers: {
                id
              }
            }
          })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.init()
      })
    },

    handleAdd() {
      this.list.push({
        type: '',
        remark: '',
        content: '',
        $edit: true,
        $dialogDelete: false
      })
    }
  }
}
</script>
