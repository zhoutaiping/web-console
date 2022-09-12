<template>
  <div>
    <yd-form-radio-button
      v-if="isBatch"
      v-model="form._policy"
      :radios="addReserved(SELECT.EDIT_TYPE_M2, 'keep')"
    />
    <DmTable
      v-if="(isBatch && form._policy !== 'keep') || !isBatch"
      border
      add-button
      style="margin-top: 12px"
      @click-add-button="handleRowAdd"
    >
      <el-table :data="form.list">
        <el-table-column
          prop="name"
          label="快照名称"
          min-width="180"
        />
        <el-table-column
          prop="backup_content"
          label="备份内容配置"
          min-width="180"
        >
          <template slot-scope="scope">
            {{ scope.row.backup_content | labelView(BACKUPS_TYPE) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="comment"
          label="备注"
          min-width="180"
        />
        <el-table-column
          align="right"
          label="操作"
          width="50"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleRowDelete(scope)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </DmTable>
    <DialogWebSnapshot
      ref="DialogWebSnapshot"
      @submit="handleUpdate"
    />
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import SELECT from '../../../constant/select'
import DialogWebSnapshot from './DialogWebSnapshot'
import dialogBatch from '@/console/cloud-speed/mixins/dialog-batch'

const FORM_ROW = {
  name: '',
  comment: '',
  backup_content: 0
}

const BACKUPS_TYPE = [
  {
    label: '首页',
    value: 0
  },
  {
    label: '全站',
    value: 1
  }
]

export default {
  components: { DialogWebSnapshot },

  mixins: [dialogBatch],

  props: {
    loading: Boolean,
    isBatch: Boolean
  },

  data() {
    return {
      BACKUPS_TYPE,
      SELECT,
      form: {
        _policy: 'keep',
        list: []
      },
      rules: {}
    }
  },

  methods: {
    handleUpdate(data) {
      this.form.list.unshift(data)
    },

    setList(list) {
      this.form.list = list
    },

    getList() {
      return this.form
    },

    handleInit() {
      this.form = [deepClone(FORM_ROW)]
    },

    handleRowAdd() {
      this.$refs.DialogWebSnapshot.handleOpen(deepClone(FORM_ROW))
    },

    handleRowDelete(scope) {
      const { $index } = scope
      this.form.list.splice($index, 1)
    }
  }
}
</script>
