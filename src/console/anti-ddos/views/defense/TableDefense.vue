<template>
  <div>
    <DmData
      ref="DmData"
      :show-pagination="showPagination"
      @init="fetchAdsList"
    >
      <DmTable
        :loading="loading"
        :min-height="!isChild"
        :type="isChild ? 'white' : ''"
      >
        <el-table
          :data="list"
          :expand-row-keys="expandList"
          row-key="uuid"
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="expand"
            width="1"
          >
            <template slot-scope="scope">
              <div style="padding: 0 16px">
                <TableDefense
                  ref="DmDataChild"
                  :parent-id="scope.row.uuid"
                  :parent-name="scope.row.name"
                  is-child
                  @selection-change="val => handleSelectionChange(val.val, scope.row.uuid)"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            label="域名称"
            min-width="280"
            prop="name"
          />

          <!-- <el-table-column
            label="配置模板"
            min-width="120"
          >
            <template slot-scope="scope">
              <span>
                {{ fomartValue(scope.row, 'protectTemplateName') }}
              </span>
            </template>
          </el-table-column> -->
          <el-table-column
            label="清洗集群"
            min-width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.agentClusterId | labelView(adsSelectCluster) }}
            </template>
          </el-table-column>
          <el-table-column
            label="IP列表"
            min-width="150"
            prop="ipList"
          />
          <el-table-column
            label="创建时间"
            min-width="150"
            prop="createTime"
          />
          <el-table-column
            label="描述"
            min-width="80"
            prop="description"
          />
          <el-table-column
            label="操作"
            align="right"
            width="400"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRowRefresh(scope.row)"
              >刷新策略</el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >修改</el-button>
              <el-divider direction="vertical" />
              <router-link :to="{name: 'anti-ddos.router.settings__id', params: { id: scope.row.protectTemplateId }, query: { defenseGroupId: scope.row.uuid, pageTitle: parentName ? `${parentName} - ${scope.row.name}` : scope.row.name }}">
                <el-button type="text">策略配置</el-button>
              </router-link>
              <template v-if="!isChild">
                <el-divider direction="vertical" />
                <template v-if="expandList.includes(scope.row.uuid)">
                  <el-button
                    type="text"
                    @click="handleHideChild(scope.row)"
                  >隐藏子域</el-button>
                </template>
                <template v-else>
                  <el-button
                    type="text"
                    @click="handleShowChild(scope.row)"
                  >查看子域</el-button>
                </template>
                <el-divider direction="vertical" />
                <el-button
                  type="text"
                  @click="handleAddChild(scope.row)"
                >添加子域</el-button>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      :is-child="isChild"
      @init="fetchRef"
    />
  </div>
</template>

<script>
import consoleDataAds from '@/mixins/consoleDataAds'
import { arrRemove } from '@/utils/array'
import DialogRow from './components/DialogRow'
import adsMixins from '../../mixins/ads'

export default {
  name: 'TableDefense',

  components: { DialogRow },

  mixins: [consoleDataAds, adsMixins],

  props: {
    isChild: Boolean,
    parentId: String,
    parentName: String
  },

  data() {
    return {
      API_INDEX: 'admin/defense/query',
      bindParams: {
        parentId: this.parentId,
        level: this.parentId ? 2 : 1
      },
      expandList: [],
      selectStatus: [
        {
          label: '启用',
          value: true
        },
        {
          label: '禁用',
          value: false
        }
      ]
    }
  },

  computed: {
    showPagination() {
      if (this.isChild) {
        return this.listTotal > 10
      } else {
        return true
      }
    }
  },

  methods: {
    fetchAdsList(params = {}) {
      this.expandList = []
      this.bindParams = Object.assign({ ...this.bindParams }, { ...params })
      this.fetchList()
    },

    fetchRef() {
      this.fetchList()
      this.$refs.DmDataChild && this.$refs.DmDataChild.fetchList()
    },

    fomartValue(data, prop) {
      let val = data[prop]
      if (val && prop === 'protectTemplateName') {
        if (val.indexOf('private') > -1) {
          val = ''
        }
      }
      return val
    },

    handleAddChild(row) {
      this.$refs.DialogRow.handleOpen({
        parentId: row.uuid,
        agentClusterId: row.agentClusterId,
        protectTemplateId: row.protectTemplateId
      }, {
        isChild: true,
        title: row.name
      })
    },

    handleShowChild(row) {
      this.expandList = [...new Set(this.expandList.concat(row.uuid))]
    },

    handleHideChild(row) {
      arrRemove(this.expandList, row.uuid)
    },

    async handleRowRefresh(row) {
      const operate = 'ref'
      try {
        await this.$Ads.post(`admin/defense/execute/${operate}`, [row.uuid])
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
    },

    handleSelectionChange(val, parentId) {
      this.$emit('selection-change', { val, parentId })
    }
  }
}
</script>
