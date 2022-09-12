<template>
  <div>
    <DmToolbar>
      <el-upload
        ref="upload"
        :on-change="fileChange"
        :show-file-list="false"
        :auto-upload="false"
        action="api"
        style="display: inline-block"
      >
        <el-button
          slot="trigger"
          type="primary"
        >上传文件</el-button>
      </el-upload>
      <el-button
        @click="handleDownload"
      >导出文件</el-button>
      <el-button
        :disabled="!selectionId.length"
        @click="handleDelete(selectionId)"
      >删除</el-button>
      <InputSearch
        slot="right"
        v-model="bindParams.ip"
        placeholder="0.0.0.0"
        @submit="handleSearch"
      />
    </DmToolbar>
    <DmData
      ref="DmData"
      @init="fetchList"
    >
      <DmTable
        :loading="loading"
        add-button
        border
        @click-add-button="handleRowAdd"
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
            label="IP"
            min-width="140"
          >
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.$edit"
                v-model="scope.row.ip"
                placeholder="0.0.0.0"
              />
              <template v-else>
                {{ scope.row.ip }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            min-width="100"
          >
            <template slot-scope="scope">
              <el-input
                v-if="scope.row.$edit"
                v-model="scope.row.remark"
                placeholder="备注"
              />
              <template v-else>
                {{ scope.row.remark }}
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="160"
            prop="format_created_at"
          />
          <el-table-column
            align="right"
            label="操作"
            width="100px"
          >
            <template slot-scope="scope">
              <template v-if="scope.row.$edit">
                <el-button
                  type="text"
                  @click="handleSaveRow(scope)"
                >保存</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="handleCancelRow(scope)"
                >取消</el-button>
              </template>
              <template v-else>
                <el-button
                  type="text"
                  @click="handleEditRow(scope)"
                >编辑</el-button>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="handleDelete([scope.row._id])"
                >删除</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import ColumnForm from '@/components/Column/ColumnForm'
import consoleLog from '@/mixins/consoleLog'
import { downloadFile } from '@/utils/export'

export default {
  components: { ColumnForm },

  mixins: [consoleLog],

  props: {
    id: String,
    dataParams: Object
  },

  data() {
    return {
      row: {
        ip: '',
        remark: ''
      },
      selectionId: [],
      bindParams: {
        ip: ''
      },
      API_INDEX: '../agw/cdn/console/user.ip.item.list',
      exportLoading: false
    }
  },

  methods: {
    formatParams(params) {
      return {
        ...params,
        ...this.dataParams
      }
    },

    handleRowSelect(selection) {
      this.selectionId = selection.map(_ => _._id)
    },

    async fileChange(file) {
      const uploadFiles = file.raw
      if (!uploadFiles) return
      const form = new FormData()
      form.append('file', uploadFiles)
      form.append('user_ip_id', this.id)
      form.append('member_id', this.userInfo.id)

      this.loading = true
      try {
        await this.Fetch.upload('../agw/cdn/console/user.ip.item.file.save', form)
      } catch (e) {
        return
      } finally {
        this.$refs.upload.clearFiles()
        this.loading = false
        this.fetchList()
      }
      this.Message('ACTION_SUCCESS')
    },

    handleRowAdd() {
      const row = deepClone(this.row)
      row.$edit = true
      this.list.push(row)
    },

    handleEditRow(scope) {
      scope.row.$cache = deepClone(scope.row)
      this.$set(scope.row, '$edit', true)
    },
    async handleDownload() {
      let url = '/agw/cdn/console/user.ip.item.export?member_id=' + this.dataParams.member_id + '&user_ip_id=' + this.dataParams.user_ip_id
      if (this.bindParams.ip) {
        url = url + '&ip=' + this.bindParams.ip
      }

      downloadFile(url)
    },

    async handleSaveRow(scope) {
      const { row: form } = scope
      const sendForm = {
        ...form,
        ...this.dataParams
      }
      try {
        if (form._id) {
          await this.Fetch.put('../agw/cdn/console/user.ip.item.edit', sendForm)
        } else {
          await this.Fetch.post('../agw/cdn/console/user.ip.item.text.save', sendForm)
        }
      } catch (e) {
        return
      }
      form.$edit = false
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    async handleDelete(ids) {
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(async() => {
        const params = {
          ids,
          ...this.dataParams
        }
        try {
          await this.Fetch.delete('../agw/cdn/console/user.ip.item.del', params)
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    handleCancelRow(scope) {
      if (scope.row._id && scope.row.$cache) {
        scope.row.ip = scope.row.$cache.ip
        scope.row.remark = scope.row.$cache.remark
        scope.row.$edit = false
      } else {
        this.list.splice(scope.$index, 1)
      }
    }
  }
}
</script>
