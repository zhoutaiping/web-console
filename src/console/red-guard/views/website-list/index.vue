<template>
  <console-page-layout>
    <DmToolbar>
      <el-button
        type="primary"
        @click="handleAddWebsite"
      >添加网站</el-button>
      <el-button
        :disabled="multipleActionDisable"
        @click="handleDelete"
      >删除</el-button>
      <template slot="right">
        <SelectPackage
          v-model="bindParams.package_id"
          style="width: 150px"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.domain"
          placeholder="请输入域名称进行查询"
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
            label="网站"
            min-width="200"
          >
            <template slot-scope="scope">
              <router-link
                :to="{
                  name: 'red-guard.router.websiteList__id',
                  query: {
                    pageTitle: scope.row.domain
                  },
                  params: {
                    id: scope.row.domain_id
                  }
              }">
                {{ scope.row.domain }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column
            label="所属套餐"
            min-width="180"
            prop="package_name"
          >
            <template slot-scope="scope">
              <ColumnPackageName :row="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            prop="meal_flag_name"
            label="套餐版本"
            min-width="120"
          />
          <el-table-column
            prop="expire_time"
            label="到期时间"
            min-width="150"
          >
            <template slot-scope="scope">
              <ColumnExpireTime :expire-time="scope.row.expire_time" />
            </template>
          </el-table-column>
          <el-table-column
            prop="service"
            label="已开通服务"
            min-width="120"
          >
            <template slot-scope="scope">
              <columnDomainService
                :show-list="['tjkd-plus', 'cdn']"
                :data="scope.row"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="服务状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.anti_status === 0"
                class="color--warning"
              >
                未开启
              </span>
              <span
                v-if="scope.row.anti_status === 1"
                class="color--success"
              >
                防御中
              </span>
              <span
                v-if="scope.row.anti_status === 2"
                class="color--danger"
              >
                已过期
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="域名节点调度"
            min-width="120"
          >
            <template slot-scope="scope">
              <ColumnSelect
                v-model="scope.row.protected_status"
                :disabled="scope.row.change_node_status === 0"
                :selects="scope.row.nodeOptions"
                @change="val => handleChangeNode(val, scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="60"
            align="right"
          >
            <template slot-scope="scope">
              <router-link :to="{name: 'red-guard.router.websiteList__id', params: {id: scope.row.domain_id}, query: {pageTitle: scope.row.domain}}">
                <el-button
                  :disabled="scope.row.disabledConsole"
                  type="text"
                >控制台</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogPackage
      ref="DialogPackage"
      @init="fetchList"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnDomain from '@/components/Column/ColumnDomain'
import ColumnPackageName from '@/components/Column/ColumnPackageName'
import ColumnDomainService from '@/components/Column/ColumnDomainService'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'
import SelectPackage from '@/components/Select/SelectPackage'
import DialogPackage from './components/DialogPackage'

export default {
  components: {
    ColumnExpireTime,
    ColumnDomain,
    ColumnPackageName,
    ColumnDomainService,
    DialogPackage,
    SelectPackage
  },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: '/V4/cloudsafe.hwws.domain.list',
      bindParams: {
        domain: '',
        package_id: ''
      }
    }
  },

  methods: {
    handleAddWebsite() {
      this.$refs.DialogPackage.handleOpen()
    },

    formatResponse(response) {
      const { list } = response
      list.forEach(item => {
        item.disabledConsole = Number(item.status) !== 1 || Number(item.anti_status) === 2
        item.nodeOptions = [
          {
            value: '0',
            label: '回源',
            disabled: false
          },
          {
            value: '1',
            label: 'Web安全加速网络',
            disabled: false
          },
          {
            value: '2',
            label: 'TCP安全加速网络',
            disabled: Object.is(item.tjkd_plus_status, '0') && Object.is(item.tjkd_status, '0')
          }
        ]
      })
      return response
    },
    // 切换域名节点调度
    async handleChangeNode(val, row) {
      const params = {
        domain_id: row.domain_id,
        protected_status: val
      }
      let fetchUrl
      if (
        Object.is(row.protected_status, '2') &&
        Object.is(row.tjkd_status, '1')
      ) {
        params.protected_status = '1'
        fetchUrl = 'V4/Tjkd.Web.Domain.protect'
      } else {
        fetchUrl = '/V4/Web.Domain.change.node'
      }

      try {
        await this.Fetch.post(fetchUrl, params)
      } catch (e) {
        return
      }

      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },
    // 删除
    handleDelete() {
      this.$confirm('确认操作', '提示', {
        type: 'warning'
      }).then(() => {
        this.fetchDelete()
      })
    },

    async fetchDelete() {
      const params = {
        ids: this.multipleSelection.map(_ => _.domain_id)
      }
      try {
        await this.Fetch.delete('/V4/cloudsafe.hwws.domain.del', params)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    }
  }
}
</script>
