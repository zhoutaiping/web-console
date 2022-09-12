<template>
  <console-page-layout>
    <DmAlert>
      1. 对证书信息编辑时，新证书绑定域名需包含原证书所绑定的域名<br>
      2. 若您的域名已配置证书，当证书编辑完成后，系统将自动更换成新的证书信息<br>
      3. 证书关联业务时，仅针对证书绑定的且已经添加到性能优化的域名<br>
      4. 证书批量关联业务时，若一个域名存在多个证书时，默认配置最近添加的证书<br>
      5. 每周最多对同一个域名申购 5 张重复证书<br>
      6. 每个注册域名每周最多可申购 50 张证书。例如，在域名 www.example.com 中，注册域名为 example.com<br>
      <template v-if="freeCaNumsInfo">
        7. 免费申购证书数量：{{ freeCaNumsInfo.total }} 张，已使用：{{ freeCaNumsInfo.used }} 张，剩余：{{ freeCaNumsInfo.rest }} 张
      </template>
    </DmAlert>
    <DmToolbar>
      <el-button
        type="primary"
        @click="$refs.DialogApplyCA.handleOpen()"
      >申购证书</el-button>
      <el-button
        type="primary"
        @click="$refs.DialogBatchApplyCA.handleOpen()"
      >批量申购</el-button>
      <el-button
        type="primary"
        @click="$refs.DialogRow.handleOpen()"
      >上传</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleExport()"
      >下载</el-button>
      <el-button
        v-if="!isChild"
        :disabled="!multipleSelection.length"
        :loading="bindLoading"
        @click="handleBind"
      >关联</el-button>
      <el-button
        :disabled="!multipleSelection.length"
        @click="handleDel"
      >删除</el-button>
      <template slot="right">
        <yd-form-select
          :selects="selectApplyStatus"
          v-model="bindParams.apply_status"
          style="width: 100px"
          default-text="申购状态"
          @change="handleSearch"
        />
        <yd-form-select
          :selects="selectStatus"
          v-model="bindParams.binded"
          style="width: 100px"
          default-text="业务状态"
          @change="handleSearch"
        />
        <yd-form-select
          :selects="selectExpire"
          v-model="bindParams.expiry_time"
          style="width: 100px"
          default-text="是否到期"
          @change="handleSearch"
        />
        <yd-form-select
          :selects="selectCA"
          v-model="bindParams.issuer"
          style="width: 100px"
          default-text="颁发机构"
          @change="handleSearch"
        />
        <InputSearch
          v-model="bindParams.keyword"
          placeholder="请输入进行查询"
          style="width: 260px"
          @submit="handleSearch"
        >
          <yd-form-select
            slot="prepend"
            :selects="selectKeyrowdType"
            v-model="keywordType"
            style="width: 110px"
          />
        </InputSearch>
      </template>
    </DmToolbar>
    <DmData
      ref="DmData"
      :page-sizes="[10, 50, 200, 1000]"
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
            prop="ca_name"
            label="证书名称"
            width="180"
          >
            <template slot-scope="scope">
              <PopoverInput
                v-model="scope.row.ca_name"
                placement="bottomLeft"
                placeholder="证书名称"
                @submit="val => handleUpdateName(val, scope.row.id)"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="ca_domain"
            label="证书绑定域名"
            min-width="250"
          >
            <template slot-scope="scope">
              <ColumnList :list="scope.row.ca_domain" />
            </template>
          </el-table-column>
          <el-table-column
            label="申购状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.apply_status === APPLY_STATUS_APPLYING"
                class="color--warning"
              >申请中</span>
              <span
                v-else-if="scope.row.apply_status === APPLY_STATUS_SUCCESS"
                class="color--success"
              >已颁发</span>
              <span
                v-else-if="scope.row.apply_status === APPLY_STATUS_FAIL"
                class="color--danger"
              >审核失败</span>
              <span
                v-else
                class="color--success"
              >上传托管</span>
            </template>
          </el-table-column>
          <el-table-column
            label="业务状态"
            min-width="100"
          >
            <template slot-scope="scope">
              <span
                v-if="scope.row.binded"
                class="color--success"
              >
                已绑定
              </span>
              <span
                v-else
                class="color--warning"
              >
                未绑定
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="issuer"
            label="颁发机构"
            min-width="200"
          />
          <el-table-column
            prop="issuer_start_time"
            label="颁发时间"
            min-width="150"
          />
          <el-table-column
            label="到期时间"
            min-width="150"
          >
            <template slot-scope="scope">
              {{ scope.row.issuer_expiry_time }}
              <template v-if="scope.row.issuer_expiry_time_desc">
                <br><span class="color--danger">{{ scope.row.issuer_expiry_time_desc }}</span>
              </template>
              <template v-if="scope.row.issuer_expiry_time_auto_renew_status">
                <br><span class="color--success">自动续期</span>
              </template>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="150"
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                :disabled="[APPLY_STATUS_APPLYING, APPLY_STATUS_SUCCESS, APPLY_STATUS_FAIL].includes(scope.row.apply_status)"
                type="text"
                @click="$refs.DialogRow.handleOpen(scope.row)"
              >编辑</el-button>
              <el-divider direction="vertical" />
              <el-button
                :disabled="[APPLY_STATUS_APPLYING, APPLY_STATUS_FAIL].includes(scope.row.apply_status)"
                type="text"
                @click="handleExport(scope.row)"
              >下载</el-button>
            </template>
          </el-table-column>
        </el-table>
      </DmTable>
    </DmData>
    <DialogRow
      ref="DialogRow"
      @init="fetchList"
    />
    <DialogBind
      ref="DialogBind"
      @init="fetchList"
    />
    <DialogApplyCA
      ref="DialogApplyCA"
      @init="fetchList"
    />
    <DialogBatchApplyCA
      ref="DialogBatchApplyCA"
      @init="fetchList"
    />
  </console-page-layout>
</template>

<script>
import consoleData from '@/mixins/consoleData'
import ColumnListMore from '@/components/Column/ColumnListMore'
import ColumnList from '@/components/Column/ColumnList'
import PopoverInput from '@/components/Popover/PopoverInput'
import { getUserstore } from '@/utils/auth'
import DialogRow from './components/DialogRow'
import DialogBind from './components/DialogBind'
import DialogApplyCA from './components/DialogApplyCA'
import DialogBatchApplyCA from './components/DialogBatchApplyCA'

const APPLY_STATUS_APPLYING = 1
const APPLY_STATUS_SUCCESS = 2
const APPLY_STATUS_FAIL = 3
const APPLY_STATUS_UPLOAD = 4

export default {
  components: { ColumnList, ColumnListMore, PopoverInput, DialogRow, DialogBind, DialogApplyCA, DialogBatchApplyCA },

  mixins: [consoleData],

  data() {
    return {
      APPLY_STATUS_APPLYING,
      APPLY_STATUS_SUCCESS,
      APPLY_STATUS_FAIL,
      APPLY_STATUS_UPLOAD,
      selectApplyStatus: [
        {
          label: '申请中',
          value: APPLY_STATUS_APPLYING
        },
        {
          label: '已颁发',
          value: APPLY_STATUS_SUCCESS
        },
        {
          label: '审核失败',
          value: APPLY_STATUS_FAIL
        },
        {
          label: '上传托管',
          value: APPLY_STATUS_UPLOAD
        }
      ],
      selectKeyrowdType: [
        {
          label: '证书名称',
          value: 'ca_name'
        },
        {
          label: '域名',
          value: 'domain'
        }
      ],
      selectStatus: [
        {
          label: '已绑定',
          value: true
        },
        {
          label: '未绑定',
          value: false
        }
      ],
      selectCA: [],
      selectExpire: [
        {
          label: '已到期',
          value: true
        },
        {
          label: '即将到期',
          value: 'inno'
        },
        {
          label: '未到期',
          value: false
        }
      ],
      API_INDEX: 'V4/Web.ca.self.list',
      bindLoading: false,
      keywordType: 'domain',
      bindParams: {
        apply_status: '',
        binded: '',
        expiry_time: '',
        keyword: '',
        issuer: ''
      }
    }
  },
  computed: {
    freeCaNumsInfo() {
      if (this.resData.free_ca_nums_info && Object.keys(this.resData.free_ca_nums_info).length) {
        return this.resData.free_ca_nums_info
      }
      return null
    },
    isChild() {
      const { userType } = getUserstore()
      return userType === 'child'
    }
  },
  methods: {
    formatParams(params) {
      params[this.keywordType] = params.keyword
      return params
    },

    formatResponse(response) {
      const { issuer_list = [], list = [] } = response
      this.selectCA = issuer_list.map(_ => {
        return {
          label: _,
          value: _
        }
      })
      list.forEach(item => {
        item.issuer_expiry_time_auto_renew_status = Number(item.issuer_expiry_time_auto_renew_status)
        item.apply_status = Number(item.apply_status)
      })
      return response
    },

    async handleDel() {
      this.$confirm('确认操作?', '提示', {
        type: 'warning'
      }).then(async () => {
        await this.Fetch.delete('V4/Web.ca.self.del', { ids: this.multipleSelection.map(_ => _.id).join(',') })
        this.Message('ACTION_SUCCESS')
        this.fetchList()
      })
    },

    async handleUpdateName(ca_name, id) {
      await this.Fetch.post('V4/Web.ca.self.editcaname', {
        id,
        ca_name
      })

      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    async handleBind() {
      const list = this.multipleSelection
      let result
      const form = {
        id: this.multipleSelection.map(_ => _.id)
      }
      this.bindLoading = true
      try {
        result = await this.Fetch.post('V4/Web.ca.batch.operat', form)
      } catch (e) {
        return
      } finally {
        this.bindLoading = false
      }

      const { fail_list, fail_total, expiry_list } = result
      if (fail_total) {
        list.forEach(item => {
          item.fail = fail_list.includes(item.ca_name)
        })
        this.$refs.DialogBind.handleOpen({
          ...result,
          list
        })
        return
      }

      if (expiry_list) {
        this.$confirm('此证书即将到期, 检测到有更新的证书, 是否继续？', '提示', {
          type: 'warning'
        }).then(async () => {
          try {
            await this.Fetch.post('V4/Web.ca.batch.operat', {
              del_id: expiry_list.del_id,
              id: expiry_list.id,
              is_confirm: 1
            })
          } catch (e) {
            return
          }
          this.Message('ACTION_SUCCESS')
          this.fetchList()
        })
        return
      }

      this.Message('ACTION_SUCCESS')
      this.fetchList()
    },

    async handleExport(row) {
      const data = await this.Fetch.get('V4/Web.ca.self.export', {
        id: row ? row.id : this.multipleSelection.map(_ => _.id)
      })
      this.Help.download(data[0].key)
    }
  }
}
</script>
