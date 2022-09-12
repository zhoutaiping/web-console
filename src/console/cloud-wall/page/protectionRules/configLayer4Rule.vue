<template>
  <div>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogAddRule.handleOpen()"
      >添加转发规则</el-button>
      <el-button
        type="primary"
        @click="$refs.DialogAddRule.handleOpen({}, {batch: true})"
      >批量添加</el-button>
      <el-button
        :disabled="multipleSelection.length === 0"
        type="primary"
        @click="handleBatchEdit"
      >批量编辑</el-button>
      <el-button
        :disabled="multipleSelection.length === 0"
        @click="handleDelete"
      >删除</el-button>
      <div slot="right">
        <yd-form-select
          v-model="bindParams.package_id"
          :selects="selectPackage"
          style="width: 150px; margin-right: 12px"
          default-text="所有套餐"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.search_source_ip_port"
          style="width: 220px"
          placeholder="转发规则/源IP/源端口/备注"
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
            label="转发协议"
            min-width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.protocol_name }}/{{ scope.row.protocol_port }}
            </template>
          </el-table-column>
          <el-table-column
            label="源IP/源端口"
            min-width="230"
          >
            <template slot-scope="scope">
              <ColumnListIp
                :list="scope.row.records"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="所属套餐"
            min-width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.instance_id }}<br>
              {{ scope.row.package_name }}
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            min-width="80"
            prop="remark"
          >
            <template slot-scope="scope">
              {{ scope.row.remark }}
            </template>
          </el-table-column>
          <el-table-column
            prop="expire_time"
            min-width="180"
            label="到期时间"
          >
            <template slot-scope="scope">
              <ColumnExpireTime :expire-time="scope.row.expire_time" />
            </template>
          </el-table-column>
          <el-table-column
            prop="loading_name"
            min-width="150"
            label="负载均衡规则"
          />
          <el-table-column
            label="操作"
            align="right"
            min-width="120"
          >
            <template slot-scope="scope">
              <ColumnAction>
                <el-button
                  type="text"
                  @click="handleRowEdit(scope.row)"
                >编辑</el-button>
                <router-link
                  :to="{
                    name: 'cloud-wall.router.protectionRules__configLayer4Rule__id',
                    params: {
                      id: scope.row.package_id
                    },
                    query: {
                      pageTitle: scope.row.package_name
                    }
                  }"
                >
                  <el-button type="text">控制台</el-button>
                </router-link>
              </ColumnAction>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddRule ref="DialogAddRule" @init="fetchList" />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'
import ColumnListIp from '@/components/Column/ColumnListIp'
import ColumnPackageName from '@/components/Column/ColumnPackageName'
import DialogRemark from '@/console/taichi-plus/views/Component/DialogRemark'
import DialogAddRule from './components/DialogAddRule'

export default {
  components: {
    DialogRemark,
    ColumnExpireTime,
    ColumnListIp,
    ColumnPackageName,
    DialogAddRule
  },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/Tjkd.plus.forward.rule.list',
      selectPackage: [],
      bindParams: {
        package_id: this.$route.query.package_id || '',
        search_source_ip_port: ''
      }
    }
  },

  created() {
    this.fetchPackageList()
  },

  methods: {
    async handleBatchEdit() {
      // 需要满足以下三个条件，才能进入批量编辑页面:
      // 1.每条记录的源端口必须和转发规则端口相同，数据预校验
      // 2.每条记录的套餐ID必须相同
      // 3.每条记录中的records数组中存的value属性中存的源IP组成的数组也得相同（ZTMDSRLGL）
      let flag = true
      let flag2 = true
      let flag3 = true
      const package_id_cache = this.multipleSelection[0].package_id
      const ips_array_cache = this.multipleSelection[0].originIpsArray
      this.multipleSelection.forEach((v, i) => {
        if (v.package_id !== package_id_cache) {
          flag2 = false
        }
        if (ips_array_cache.sort().toString() !== v.originIpsArray.sort().toString()) {
          flag3 = false
        }
        v.records.forEach((v2, i2) => {
          if (v2.port !== v.protocol_port) {
            flag = false
          }
        })
      })
      if (flag === false) {
        this.$message.warning('批量编辑时，每条记录的源端口必须和转发规则端口相同')
        return
      }
      if (flag2 === false) {
        this.$message.warning('批量编辑时，每条记录的套餐必须相同')
        return
      }
      if (flag3 === false) {
        this.$message.warning('批量编辑时，每条记录的源IP数组必须相同')
        return
      }
      // 参数组装
      let arrParam = []
      this.multipleSelection.forEach((v, i) => {
        arrParam = arrParam.concat(v.ids)
      })
      this.batchEditBtnLoading = true

      let data
      try {
        data = await this.Fetch.post('V4/Tjkd.plus.forward.rule.batch.info', { ids: arrParam })
      } catch (e) {
        this.batchEditBtnLoading = false
        return
      }

      data.protocol = Number(data.protocol)
      data.loading = Number(data.loading)
      data.source_type = Number(data.source_type)
      data.protocol_port = data.protocol_port.join(',')

      data.package_id = package_id_cache
      data.records = data.source

      this.$refs.DialogAddRule.handleOpen(data, { batch: true, mode: 'Edit' })
    },

    formatResponse(response) {
      const { list = [] } = response
      list.forEach(item => {
        item.protocol = Number(item.protocol)
        item.loading = Number(item.loading)
        item.source_type = Number(item.source_type)

        const arr = []
        item.records.forEach((v2, i2) => {
          arr.push(v2.value)
        })
        item.originIpsArray = arr
      })
      return response
    },

    async fetchPackageList() {
      const { list = [] } = await this.Fetch.get('V4/Tjkd.plus.package.all')
      list.forEach(item => {
        item.disabled = item.flag
      })
      this.selectPackage = list
    },

    handleDelete() {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fetchDelete()
      })
    },

    handleRowEdit(form) {
      this.$refs.DialogAddRule.handleOpen(form, { mode: 'Edit' })
    },

    async fetchDelete() {
      const ids = []
      this.multipleSelection.forEach(_ => {
        ids.push(..._.ids)
      })
      const params = {
        ids
      }
      try {
        await this.Fetch.delete('V4/Tjkd.plus.forward.rule.del', params)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    }
  }
}
</script>
