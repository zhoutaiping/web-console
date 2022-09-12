<template>
  <console-page-layout>
    <DmAlert>
      Web安全加速中未授权的证书将无法在证书管理和HTTPS服务中关联证书绑定的域名
    </DmAlert>
    <DmCard class="margin-top">
      <!-- <DmToolbar>
        <el-button
          type="primary"
          @click="fetchData"
        >刷 新</el-button>
      </DmToolbar> -->
      <DmTable :loading="loading">
        <el-table :data="reslist">
          <el-table-column
            label="产品模块"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.name }}
            </template>
          </el-table-column>
          <el-table-column
            label="授权对象类型"
            prop="type"
            min-width="150"
          />
          <el-table-column
            label="指定授权对象"
            prop="record"
            min-width="150"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.resource_all > 0 ">全部资源</span>
              <div
                v-else
                style="display:flex"
              >
                <div style="width:90%;">
                  <div
                    v-for="(item, index) in (scope.row.record).slice(0, 2)"
                    :key="'key1_'+index+'-'+scope.$index"
                  >
                    {{ recordText(item, scope.row.flag) }}
                  </div>
                  <template v-if="scope.row.show === true && scope.row.record.length > 2">
                    <div
                      v-for="(item, _index) in (scope.row.record).slice(2)"
                      :key="'key2_'+_index+'-'+scope.$index"
                    >
                      {{ recordText(item, scope.row.flag) }}
                    </div>
                  </template>
                </div>
                <div
                  v-if="scope.row.record.length > 2"
                  style="flex:1;text-align:center; cursor: pointer;"
                  @click="domainText(scope.row,scope.$index)"
                >
                  <i
                    class="el-icon-arrow-down color--primary"
                    style="float: right;"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="right"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="$refs.DialogSetting.handleOpen(scope.row)"
              >
                授权对象管理
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmCard>
    <DialogSetting
      ref="DialogSetting"
      @init="fetchData"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import DialogSetting from './components/DialogSetting'
import { deepClone } from '@/utils'
export default {
  components: { DialogSetting },
  mixins: [consoleData],
  data() {
    return {
      loading: false,
      groupData: {},
      groupId: this.$route.params.id,
      defaultList: [
        {
          name: 'Web安全加速', subuser_group_id: this.$route.params.id, type: '网站', show: false, flag: 'cdn_domain', record: []
        },
        {
          name: 'Web安全加速', subuser_group_id: this.$route.params.id, type: '证书名称', show: false, flag: 'ca', record: []
        },
        {
          name: '预防&加固', subuser_group_id: this.$route.params.id, type: '资产名称', show: false, flag: 'property', record: []
        },
        {
          name: '调查响应', subuser_group_id: this.$route.params.id, type: '报告名称', show: false, flag: 'service_report', record: []
        },
        {
          name: '调查响应', subuser_group_id: this.$route.params.id, type: '计划名称', show: false, flag: 'service_report_plan', record: []
        }
      ],
      reslist: []
    }
  },

  created() {
    this.fetchData()
  },

  methods: {
    domainText(data, index) {
      const show = data.show || false
      const list = JSON.parse(JSON.stringify(this.reslist))
      list[index].show = !show
      this.reslist = list
    },

    recordText(data, prop) {
      const label_map = {
        'cdn_domain': 'domain',
        'ca': 'ca_name',
        'property': 'property_name',
        'service_report': 'report_name',
        'service_report_plan': 'report_name'
      }
      return data[label_map[prop]] || ''
    },

    async fetchData() {
      try {
        this.loading = true
        this.reslist = deepClone(this.defaultList)
        await this.getPolicy()
      } finally {
        this.loading = false
      }
    },
    async getPolicy() {
      await this.Fetch.get('/V4/subacl.user.group.get.resource.policy', {
        subuser_group_id: this.groupId
      }).then(res => {
        this.setRow(res || {})
      })
    },

    setRow(data) {
      const list = deepClone(this.defaultList).map(i => {
        i.resource_all = data.resource_policy && data.resource_policy[i.flag] && data.resource_policy[i.flag].resource_all || 0
        return i
      })
      this.reslist = list
      list.forEach((e, index) => {
        if (e.resource_all === 0) {
          this.getGroupRecord(e.flag, index)
        }
      })
    },

    patams(type) {
      return {
        'subuser_group_id': this.groupId,
        'resource_type': type,
        'bind_type': 'bind',
        'keyword': '',
        'page': 1,
        'per_page': 10
      }
    },
    async getGroupRecord(type, index = 0) {
      const params = this.patams(type)
      try {
        const data = await this.Fetch.get('/V4/subacl.user.group.resource', params)
        this.reslist[index].record = data.list
        this.reslist[index].recordTotal = data.total
      } catch (e) {
        return
      }
    }
  }
}
</script>
