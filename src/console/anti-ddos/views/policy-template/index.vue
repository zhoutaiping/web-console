<template>
  <ConsolePageLayout>
    <!-- <DmAlert>
      配置模板策略参数被修改时，会同步修改已引用该配置模板的防御域的配置参数。
    </DmAlert> -->
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >新增配置模板</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleAction('del')"
      >删除</el-button>
      <template slot="right">
        <InputSearch
          v-model="bindParams.name"
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
            label="模板名称"
            min-width="180"
            prop="name"
          />
          <el-table-column
            label="描述"
            min-width="100"
            prop="description"
          />
          <!-- <el-table-column
            label="已绑定防御域"
            min-width="200"
          >
            <template slot-scope="scope">
              <ColumnListMore
                v-if="scope.row.defenseGroupList"
                :value="scope.row.defenseGroupList.map(_ => _.name)"
              />
              <template v-else>-</template>
            </template>
          </el-table-column> -->
          <el-table-column
            label="创建时间"
            min-width="150"
            prop="updateTime"
          />
          <el-table-column
            label="操作"
            align="right"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <router-link :to="{ name: 'anti-ddos.router.settings__id', params: {id: scope.row.uuid}, query: {pageTitle: scope.row.name} }">策略配置</router-link>
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
import ColumnListMore from '@/components/Column/ColumnListMore'
import DialogRow from './components/DialogRow'

export default {
  components: { ColumnListMore, DialogRow },

  mixins: [consoleDataAds],

  data() {
    return {
      API_INDEX: 'admin/template/query',
      selectStatus: [
        {
          label: '启用',
          value: true
        },
        {
          label: '禁用',
          value: false
        }
      ],
      bindParams: {
        isPublic: true,
        name: '',
        status: '',
        nohealth: false,
        daterange: []
      }
    }
  },

  methods: {
    formatParams(params) {
      const [startTime, endTime] = params.daterange
      return {
        ...params,
        startTime,
        endTime
      }
    },

    handleAction(operate) {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await this.$Ads.post(`admin/template/execute/${operate}`, this.multipleSelection.map(_ => _.uuid))
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
