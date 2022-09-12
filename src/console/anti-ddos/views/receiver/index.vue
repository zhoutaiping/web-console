<template>
  <ConsolePageLayout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增联系人</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('del')"
      >删除</el-button>
      <template slot="right">
        <InputSearch
          v-model="bindParams.name"
          placeholder="姓名"
          @submit="handleSearch"
        />
        <InputSearch
          v-model="bindParams.email"
          placeholder="邮箱"
          @submit="handleSearch"
        />
        <InputSearch
          v-model="bindParams.phone"
          placeholder="手机号"
          @submit="handleSearch"
        />
      </template>
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
            label="姓名"
            min-width="150"
            prop="name"
          />
          <el-table-column
            label="邮箱"
            min-width="150"
            prop="email"
          />
          <el-table-column
            label="手机号"
            min-width="150"
            prop="phone"
          />
          <el-table-column
            label="操作"
            align="right"
            width="100"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
  </ConsolePageLayout>
</template>

<script>
import consoleDataAds from '@/mixins/consoleDataAds'
import DialogRow from './components/DialogRow'

export default {
  components: { DialogRow },

  mixins: [consoleDataAds],

  data() {
    return {
      API_INDEX: 'admin/receiver/query',
      bindParams: {
        name: '',
        email: '',
        phone: ''
      }
    }
  },

  methods: {
    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async() => {
        try {
          await this.$Ads.post(`admin/receiver/execute/${operate}`, this.multipleSelection.map(_ => _.uuid))
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
