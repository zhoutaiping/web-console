<template>
  <ConsolePageLayout>
    <DmAlert>
      批量添加网站时，若为网站批量添加源IP，需所有网站的源站地址与监听端口一致。
    </DmAlert>
    <yd-card-list style="margin-top: 12px">
      <yd-card>
        <el-form
          ref="form"
          :model="form"
          :rules="formRules"
          label-width="130px"
        >
          <el-form-item
            label="添加网站"
            prop="domains"
          >
            <el-input
              :rows="10"
              v-model="form.domains"
              type="textarea"
              placeholder="请输入网站，多个网站使用回车分隔，单次允许添加500个网站"
            />
          </el-form-item>
          <el-form-item
            v-if="showBuyForm"
            label="计费方式"
          >
            <yd-form-radio
              :radios="SELECT.CDN_ACCOUNTING_RULES"
              v-model="form.buy_cdn.accounting_rules"
            />
          </el-form-item>
          <el-form-item
            v-if="appAssets.companyEN === 'Westone'"
            label="起止时间"
          >
            <el-date-picker
              v-model="daterange"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="more"
              label="是否为网站添加源IP"
              name="type"
            />
          </el-form-item>
          <el-form-item v-if="more">
            <DmTable>
              <toolbar>
                <el-button
                  :disabled="list.length === 2"
                  type="primary"
                  @click="handleClickAdd"
                >
                  + 添加
                </el-button>
              </toolbar>
              <el-table :data="list">
                <el-table-column label="协议类型">
                  <template slot-scope="scope">
                    {{ scope.row.protocol | labelView(moduleLabel['cloud-speed'].PROTOCOL_TYPE) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="监听端口"
                  prop="listen_port"
                />
                <el-table-column label="取源协议">
                  <template slot-scope="scope">
                    {{ scope.row.get_source_protocol | labelView(SELECT.SOURCE_PROTOCOL) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="负载均衡方式"
                  min-width="100"
                >
                  <template slot-scope="scope">
                    {{ scope.row.load_balance | labelView(SELECT.BALANCING_TYPE) }}
                  </template>
                </el-table-column>
                <el-table-column label="回源设置">
                  <template slot-scope="scope">
                    {{ scope.row.back_source_type | labelView(SELECT.RETURN_SETTING) }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="取源地址/端口"
                  min-width="200"
                >
                  <template slot-scope="scope">
                    <ColumnListIp :list="scope.row.source_ips" />
                  </template>
                </el-table-column>
                <el-table-column
                  align="right"
                  label="操作"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="handleItemEdit(scope.row, scope.$index)"
                    >编辑</el-button>
                    <el-button
                      type="text"
                      @click="handleItemDelete(scope.$index)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </DmTable>
          </el-form-item>
          <el-form-item v-if="!isChild">
            <el-checkbox
              v-model="addGroup"
              style="margin-right: 10px"
            >是否为网站添加到分组</el-checkbox>
            <template v-if="addGroup">
              <GroupList
                v-model="form.group_id"
                style="margin-top: 10px"
              />
            </template>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="setDomainName"
              style="margin-right: 10px"
            >是否为网站添加相同的网站名称</el-checkbox>
          </el-form-item>
          <el-form-item
            v-if="setDomainName"
            prop="domain_name"
          >
            <el-input
              v-if="setDomainName"
              v-model="form.domain_name"
              placeholder="网站名称"
              style="width: 280px"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loadingSubmit"
              style="width: 100px"
              type="primary"
              @click="handleSubmit"
            >提交</el-button>
          </el-form-item>
        </el-form>
      </yd-card>
    </yd-card-list>
    <DialogAddSourceIp
      ref="dialogAddSourceIp"
      @submit="handleUpdateList"
    />
  </ConsolePageLayout>
</template>

<script>
import ColumnListIp from '@/components/Column/ColumnListIp'
import DialogAddSourceIp from './components/DialogAddSourceIp'
import { isDef, deepClone } from '@/utils'
import RULE from '@/utils/verify'
import GroupList from '../../website-group/list'
import SELECT from '../../../constant/select'

function urlVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = value.split(/[\n\r]/g)
    value = value.filter(_ => _)
  } else {
    if (!value[0]) callback(new Error('请填写'))
  }

  value.forEach(item => {
    if (!RULE.domainWithPan.test(item)) {
      callback(new Error('格式有误'))
    }
  })
  callback()
}
import { getUserstore } from '@/utils/auth'
export default {
  components: {
    ColumnListIp,
    DialogAddSourceIp,
    GroupList
  },

  data() {
    const { userType } = getUserstore()
    const isChild = userType === 'child'
    return {
      daterange: [],
      isChild: isChild,
      addGroup: false,
      setDomainName: false,
      SELECT,
      list: [],
      more: false,
      editIndex: null,
      loadingSubmit: false,
      showBuyForm: false,
      form: {
        domains: '',
        domain_name: '',
        group_id: '',
        buy_cdn: {
          accounting_rules: 1
        }
      },
      formRules: {
        domains: [
          { required: true, trigger: 'blur', message: '请填写域名' },
          {
            validator: urlVaildate,
            trigger: 'blur'
          }
        ],
        domain_name: [
          { required: true, trigger: 'blur', message: '请填写网站名称' },
          { min: 1, max: 32, message: '大于最大长度', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    this.daterange = []
    if (this.appEnv === 'baishan') this.fetchPayStatus()
  },

  methods: {
    // 是否已绑定套餐
    async fetchPayStatus() {
      const planData = await this.Fetch.post('V4/plan.get.meal_flag', {
        meal_flag: 'YD-JS999G-CDN'
      })
      this.showBuyForm = !planData.id
    },
    // 源IP更新
    handleUpdateList(form) {
      const index = this.editIndex
      const list = this.list

      if (isDef(index)) {
        const listPort = list.map(_ => _.listen_port)
        listPort.splice(index, 1)

        if (listPort.includes(form.listen_port)) {
          this.$message.warning('端口已存在')
          return
        }

        list.splice(index, 1, form)
      } else {
        const listPort = list.map(_ => _.listen_port)
        if (listPort.includes(form.listen_port)) {
          this.$message.warning('端口已存在')
          return
        }
        list.push(form)
      }
      this.$refs.dialogAddSourceIp.handleClose()
    },
    // 源IP编辑
    handleItemEdit(form, index) {
      this.editIndex = index
      this.$refs.dialogAddSourceIp.handleOpen(form)
    },

    handleItemDelete(index) {
      const list = this.list
      list.splice(index, 1)
    },

    handleClickAdd() {
      this.editIndex = null
      this.$refs.dialogAddSourceIp.handleOpen()
    },

    async handleSubmit() {
      if (this.more && this.list.length === 0) {
        this.$message.warning('请填写源站IP')
        return
      }

      this.$refs.form.validate(async valid => {
        if (!valid) return

        const form = deepClone(this.form)
        const domains = form.domains.split(/[\n\r]/g).filter(_ => _)
        const domainMap = new Set()
        domains.forEach(domain => {
          if (domainMap.has(domain)) {
            this.$message.warning(`请检查重复域名：${domain}`)
            throw new Error()
          }
          domainMap.add(domain)
        })

        this.loadingSubmit = true
        const [begin_time, expire_time] = this.daterange

        const send = {
          group_id: this.addGroup ? form.group_id : '',
          domains,
          begin_time,
          expire_time,
          domain_name: this.form.domain_name,
          sets: this.list
        }

        if (this.showBuyForm) {
          send.buy_cdn = form.buy_cdn
        }

        try {
          await this.Fetch.post('V4/Web.Domain.batch.domain.add', send)
        } catch (e) {
          return
        } finally {
          this.loadingSubmit = false
        }
        this.Message('TASK_SUBMIT')
        this.$router.push({
          name: 'cloud-speed.router.businessList'
        })
      })
    }
  }
}
</script>
