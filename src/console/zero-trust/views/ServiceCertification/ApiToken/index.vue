<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleDelete"
      >删除</el-button>
      <div slot="right">
        <InputSearch
          v-model="bindParams.token_name"
          placeholder="Token 名称"
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
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="Token 名称"
            prop="token_name"
            min-width="150"
          />
          <el-table-column
            label="Client ID"
            min-width="200"
          >
            <template slot-scope="scope">
              <PopoverEllipsis
                v-model="scope.row.client_id"
                :url="false"
                :max-length="30"
                line-feed
              />
              <el-button
                type="text"
                @click="handleCopy(scope.row.client_id)"
              >复制</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="status"
            min-width="80"
          />
          <el-table-column
            label="创建时间"
            prop="created_at"
            min-width="150"
          />
          <el-table-column
            label="过期时间"
            prop="expire_time"
            min-width="150"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.DialogExpire.handleOpen(scope.row)"
              >延长期限</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @show-client="handleShowClient"
      @init="fetchList"
    />
    <DialogExpire
      ref="DialogExpire"
      @init="fetchList"
    />
    <DialogClient ref="DialogClient" />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import PopoverEllipsis from '@/components/Popover/PopoverEllipsis'
import DialogRow from './components/DialogRow'
import DialogExpire from './components/DialogExpire'
import DialogClient from './components/DialogClient'

export default {
  components: { PopoverEllipsis, DialogRow, DialogExpire, DialogClient },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/zero.trust.api.token.list',
      bindParams: {
        token_name: ''
      }
    }
  },

  computed: {
    selectionId() {
      return this.multipleSelection.map(_ => _.api_token_id)
    }
  },

  methods: {
    handleCopy(text) {
      this.Help.copyText(text)
      this.$message.success('复制成功')
    },

    handleShowClient(form) {
      this.$refs.DialogClient.handleOpen(form)
    },
    formatResponse(response) {
      return response
    },

    handleDelete() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.Fetch.delete('V4/zero.trust.api.token.del', { api_token_ids: this.selectionId })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    handleAction() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          // await this.Fetch.delete('V4/Web.ca.self.del', { ids: this.selectionId.join(',') })
        } catch (e) {
          return
        }
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    }
  }
}
</script>
