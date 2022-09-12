<template>
  <div>
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
        <yd-form-select
          v-model="bindParams.package_id"
          :selects="packageList"
          style="width: 150px"
          default-text="所有套餐"
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
              <ColumnRouter
                :path="scope.row.domain_id"
                append
              >
                {{ scope.row.domain }}
              </ColumnRouter>
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
                :show-list="['cdn']"
                :data="scope.row"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="服务状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <ColumnAntiStatus :row="scope.row" />
            </template>
          </el-table-column>
          <el-table-column
            label="域名节点调度"
            min-width="120"
          >
            <template slot-scope="scope">
              <ColumnSelect
                v-model="scope.row.protected_status"
                :disabled="!Object.is(scope.row.status, '1')"
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
              <router-link
                :to="{
                  name: 'cloud-wall.router.protectionRules__configLayer7Rule__id',
                  params: {
                    id: scope.row.domain_id
                  },
                  query: {
                    pageTitle: scope.row.domain
                  }
              }">
                <el-button
                  :disabled="scope.row.status !== '1' || scope.row.anti_status === 2"
                  type="text"
                >控制台</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogAddWebsite
      ref="DialogAddWebsite"
      @submit="handleAddWebsiteSubmit"
    />
  </div>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnDomainService from '@/components/Column/ColumnDomainService'
import ColumnPackageName from '@/components/Column/ColumnPackageName'
import ColumnAntiStatus from './components/ColumnAntiStatus'
import ColumnExpireTime from '@/components/Column/ColumnExpireTime'
import SelectPackage from '@/components/Select/SelectPackage'
import DialogAddWebsite from './components/DialogAddWebsite'

export default {
  components: {
    SelectPackage,
    ColumnExpireTime,
    ColumnDomainService,
    ColumnPackageName,
    ColumnAntiStatus,
    DialogAddWebsite
  },

  mixins: [consoleData],

  data() {
    return {
      API_INDEX: 'V4/Tjkd.plus.domain.list',
      packageList: [],
      bindParams: {
        domain: '',
        package_id: this.$route.query.package_id || ''
      }
    }
  },

  created() {
    this.$emit('updateTitle', '防护规则')
    this.getPackageListSelect()
  },

  methods: {
    async handleAddWebsiteSubmit(form) {
      try {
        await this.Fetch.post('V4/Tjkd.plus.domain.add', form)
      } catch (e) {
        this.$refs.DialogAddWebsite.resetSubmitLoading()
        return
      }
      this.$refs.DialogAddWebsite.handleClose()
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    async getPackageListSelect() {
      const data = await this.Fetch.get('V4/Tjkd.plus.package.all')
      this.packageList = data.list
    },

    handleAddWebsite() {
      this.$refs.DialogAddWebsite.handleOpen()
    },

    formatResponse(response) {
      const { list } = response
      list.forEach(item => {
        item.nodeOptions = [{
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
    // 改变域名节点调度
    async handleChangeNode(val, row) {
      const params = {
        domain_id: row.domain_id,
        protected_status: val
      }
      let fetchUrl
      if (
        Object.is(row.protected_status, '2') && Object.is(row.tjkd_status, '1')
      ) {
        params.protected_status = '1'
        fetchUrl = 'V4/Tjkd.Web.Domain.protect'
      } else {
        fetchUrl = 'V4/Web.Domain.change.node'
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
      this.$confirm('确认操作？', '提示', {
        type: 'warning'
      }).then(() => {
        this.deleteWebsite()
      })
    },

    async deleteWebsite() {
      const params = {
        package_domain_ids: this.multipleSelection.map(_ => _.domain_id)
      }
      try {
        await this.Fetch.delete('/V4/Tjkd.plus.domain.del', params)
      } catch (e) {
        return
      }
      this.Message('ACTION_SUCCESS')
      this.fetchList()
    }
  }
}
</script>
