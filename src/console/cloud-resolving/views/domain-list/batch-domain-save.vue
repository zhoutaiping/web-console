<template>
  <console-page-layout>
    <yd-card grey>
      <el-form
        v-loading="loading"
        :model="batchDomainForm"
        label-width="100px"
      >
        <el-form-item label="域名列表">
          <el-input
            v-model="batchDomainForm.domain"
            :autosize="{ minRows: 15, maxRows: 25}"
            type="textarea"
            placeholder="请使用回车分割多个域名，一次最多一百个！"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="batchDomainForm.add_record">同时为新域名添加 @ 和 www 的 A 记录</el-checkbox>
          <el-input
            v-show="batchDomainForm.add_record"
            v-model="batchDomainForm.record_value"
            placeholder="0.0.0.0"
            style="width:180px; margin-left: 16px"
          />
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="addGroup">是否为网站添加到分组</el-checkbox>
          <template v-if="addGroup">
            <GroupList
              v-model="batchDomainForm.group_id"
              style="margin-top: 10px"
            />
          </template>
        </el-form-item>
        <el-button
          type="primary"
          style="width:100px; margin-left:100px;"
          @click="handleSubmit"
        >提交</el-button>
      </el-form>
    </yd-card>
  </console-page-layout>
</template>

<script>
import verify from '@/utils/verify'
import GroupList from '../website-group/list'

export default {
  components: {
    GroupList
  },

  data() {
    return {
      addGroup: false,
      loading: false,
      batchDomainForm: {
        domain: '',
        add_record: false,
        record_value: '',
        group_id: ''
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    init() {
      this.loading = false
      this.batchDomainForm.domain = ''
      this.batchDomainForm.record_value = ''
      this.batchDomainForm.add_record = false
    },

    async handleSubmit() {
      const { domain, add_record, record_value } = this.batchDomainForm
      const newDomainList = []
      const newDomain = domain.split('\n')
      const that = this
      let domainError = true
      newDomain.forEach(element => {
        if (element) {
          const domainStr = element.replace(/(^\s*)|(\s*$)/g, '')
          if (!verify.domain.test(domainStr)) {
            that.$message({
              showClose: true,
              message: domainStr + '域名格式错误!',
              type: 'error'
            })
            domainError = false
            return
          } else {
            newDomainList.push(domainStr)
          }
        }
      })

      if (!domainError) {
        return
      }

      if (!newDomainList.length) {
        this.$message.error('请输入域名')
        return
      }
      if (newDomainList.length > 100) {
        this.$message.error('超过一百行！')
        return
      }

      if (add_record) {
        const Ipv4Reg = /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
        if (record_value === '') {
          this.$message.error('请填写记录IP！')
          return
        }

        if (!Ipv4Reg.test(record_value)) {
          this.$message.error('记录值格式错误')
          return
        }
      }
      const params = {
        domain: newDomainList,
        add_record: add_record ? 1 : 0,
        record_value: add_record ? record_value : '',
        group_id: this.addGroup ? this.batchDomainForm.group_id : ''
      }

      this.loading = true

      try {
        await this.Fetch.post('V4/CloudDns.Domain.DnsDomain.batchAdd', params)
      } catch (e) {
        this.loading = false
        return
      }
      this.Message('TASK_SUBMIT')
      this.init()
    }
  }
}
</script>
