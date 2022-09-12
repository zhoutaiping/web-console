<template>
  <DmDialog
    ref="Dialog"
    :mode="mode"
    :fetch-submit="fetchSubmit"
    width="760px"
    title="批量申购证书"
    submit-text="确定"
    @submit="handleSubmit"
  >
    <DmAlert>
      1. 单次最多支持选择1000条域名<br>
      2. 域名需接入WEB安全加速<br>
      3. 如您需要为泛域名申购证书，请确保泛域名的主域名已接入DNS安全加速
    </DmAlert>
    <el-form style="padding: 12px">
      <el-tabs v-model="form.activeName">
        <el-tab-pane
          :label="isChild ? '域名导入' : '分组导入'"
          name="group"
        >
          <el-form-item
            v-show="!isChild"
            label="分组名称"
          >
            <yd-form-select
              :selects="selectGroup"
              v-model="form.groupId"
              default-text="全部"
              @change="$refs.TransferMany.init({ initIn: false })"
            />
          </el-form-item>
          <el-form-item>
            <TransferMany
              ref="TransferMany"
              :is_custom="false"
              :size="1000"
              :fetch-out-list="val => fetchDomainList(val)"
              in-label="已选择"
              out-label="组内域名"
            />
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane
          label="手动输入"
          name="custom"
        >
          <el-form-item>
            <el-input
              :rows="20"
              v-model="form.domain"
              type="textarea"
              placeholder="请输入需要绑定的域名，最多输入1000条"
            />
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </DmDialog>
</template>

<script>
import createDialog from '@/utils/createDialog'
import TransferMany from '@/components/Transfer/TransferMany'
import { getUserstore } from '@/utils/auth'
export default createDialog({
  components: { TransferMany },

  data() {
    const { userType } = getUserstore()
    const isChild = userType === 'child'
    return {
      isChild: isChild,
      formDefault: {
        activeName: 'group',
        domain: '',
        groupId: ''
      },
      selectGroup: []
    }
  },

  methods: {
    initOptions(form, options) {
      this.$refs.TransferMany.init()
      this.fetchGroupList()
    },

    async fetchSubmit() {
      try {
        await this.Fetch.post('V4/Web.ca.apply.add', {
          domain: this.form.activeName === 'group' ? this.$refs.TransferMany.loadSelectIn() : this.form.domain.split(/[\n\r]/g).filter(Boolean)
        })
      } catch (e) {
        const { message } = e.status
        const { notUseCdnDomains = [], hasApply = [], notUseDnsDomain = [] } = e.data
        let domain
        if (notUseCdnDomains.length) {
          domain = notUseCdnDomains.join(', ')
        }
        if (hasApply.length) {
          domain = hasApply.join(', ')
        }
        if (notUseDnsDomain.length) {
          domain = notUseDnsDomain.join(', ')
        }

        if (domain) {
          this.$alert(`域名：${domain} ${message}`, '提示', {
            confirmButtonText: '确定'
          })
        }
        throw new Error()
      }
    },
    // 读取分组
    async fetchGroupList() {
      const data = await this.Fetch.get('V4/web.domain.group.list', {
        per_page: 1000
      })
      this.selectGroup = data.list.map((_) => {
        return {
          label: _.group_name,
          value: _.id
        }
      })
    },

    async fetchDomainList(params) {
      const res = await this.Fetch.get('V4/Web.ca.group.domain.list', {
        ...params,
        domain: params.keyword,
        group_id: this.form.groupId
      })

      const list = res.list.map(_ => {
        return {
          label: _.domain,
          value: _.domain
        }
      })

      return {
        list,
        total: Number(res.total)
      }
    },

    async handleSubmit(form) {
      this.Message('ACTION_SUCCESS')
      this.$emit('init')
      this.handleClose()
    }
  }
})
</script>
