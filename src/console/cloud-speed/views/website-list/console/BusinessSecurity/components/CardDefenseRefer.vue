<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="loading"
    title="防盗链"
  >
    <yd-form-select
      slot="action"
      :selects="policyGroupOptions"
      v-model="policyGroupStatus"
      @change="handleChangeStatus"
    />
    <template slot="tips">
      <p>保护网站资源不被外部盗用</p>
    </template>
    <DmAlert>
      <p>开启白名单后只允许白名单中域名访问，开启黑名单后只禁止黑名单中域名访问</p>
      <p>由 <router-link to="./waf">精准访问控制引擎</router-link> 驱动，开启防御后具体防御策略配置请至 <router-link to="./waf">精准访问控制引擎</router-link> 处查看</p>
    </DmAlert>
    <el-form
      v-if="wafGroupIds.aR && policyGroupStatus === 'open'"
      ref="Form"
      :rules="rules"
      :model="data"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="选择模式">
        <el-radio-group
          v-model="mode"
          @change="handleChangeMode"
        >
          <el-radio label="white">白名单模式</el-radio>
          <el-radio label="black">黑名单模式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="data">
        <InputMultiple
          v-model="data.data"
          placeholder="www.demo.com"
          style="width: 300px; margin-right: 12px; display: inline-block"
        />
        <el-button
          :loading="updateLoading"
          type="primary"
          @click="handleUpdate"
        >更新</el-button>
      </el-form-item>
    </el-form>
  </CardItemForm>
</template>

<script>
import wafMixins from '@/console/red-guard/mixins/waf'
import InputMultiple from '@/components/Input/InputMultiple'
import RULE from '@/utils/verify'
import consoleItem from '../../../../../mixins/consoleItem'
import consolePolicyGroup from '@/mixins/consolePolicyGroup'
import { SUFFIX_LIST } from '@/constants/suffix'

function refererVaildate(rule, value, callback) {
  if (typeof value === 'string') {
    value = [value]
  } else {
    if (!value[0]) callback(new Error('请填写'))
  }

  value.forEach(item => {
    if (!RULE.domainWithPan.test(item) && !RULE.domain.test(item)) {
      callback(new Error('格式不正确'))
    }
  })
  callback()
}

export default {
  name: 'CardDefenseRefer',

  components: { InputMultiple },

  mixins: [consoleItem, consolePolicyGroup, wafMixins],

  data() {
    return {
      policyGroupType: 'aR',
      mode: 'white',
      updateLoading: false,
      data: {
        id: '',
        logic: 'not_equals',
        data: [],
        suffix: []
      },
      rules: {
        data: [{ validator: refererVaildate, trigger: 'blur' }]
      }
    }
  },

  methods: {
    async init() {
      await this.fetchPolicyGroup()
      if (this.wafGroupIds[this.policyGroupType]) {
        await this.fetchData()
      }
      this.loading = false
    },

    async handleChangeStatus() {
      await this.confirmAction()
      await this.handleChangePolicyGroupStatus()
      this.$nextTick(() => {
        this.fetchData()
      })
    },

    async fetchData() {
      const res = await this.Fetch.get('V4/firewall.policy.get_groupId', {
        group_id: this.wafGroupIds[this.policyGroupType]
      })

      const { list = [] } = res
      const ruleData = list[0]
      const data = {
        id: '',
        logic: 'not_equals',
        data: []
      }
      if (ruleData) {
        const { rules } = ruleData
        data.id = ruleData.id

        const itemData = rules[0]
        const { logic } = itemData
        this.mode = logic === 'not_equals' ? 'white' : 'black'

        data.logic = logic
        data.data = itemData.data
      }
      this.data = data
    },

    formatRuleData(form) {
      const data = {
        action: 'deny',
        type: 'plus',
        id: form.id,
        group_id: this.policyGroupData.id,
        domain_id: this.domainId,
        rules: [
          {
            data: form.data,
            logic: form.logic,
            rule_type: 'referer_domain'
          },
          {
            data: { len: 0 },
            logic: 'len_greater_than',
            rule_type: 'referer'
          },
          {
            // data: SUFFIX_LIST.filter(_ => _.key !== 'web').map(_ => _.list).reduce((total, item) => total + item).split(','),
            data: SUFFIX_LIST.filter(_ => _.key !== 'web').map(_ => _.list).reduce((total, item) => total + ',' + item).split(','),
            logic: 'equals',
            rule_type: 'postfix'
          }
        ]
      }
      return data
    },

    async handleChangeMode() {
      const data = this.data
      data.logic = this.mode === 'white' ? 'not_equals' : 'equals'
    },

    async handleUpdate() {
      await this.confirmAction()
      this.$refs.Form.validate(async valid => {
        if (!valid) throw new Error()

        this.updateLoading = true
        const ruleData = this.data

        try {
          if (ruleData.data.length === 0) {
            // 删除规则
            if (ruleData.id) {
              await this.Fetch.post('V4/firewall.policy.delete', { ids: [ruleData.id] })
              ruleData.id = ''
            }
          } else {
            const res = await this.Fetch.post('V4/firewall.policy.save', this.formatRuleData(ruleData))
            this.data.id = res.id
          }
        } catch (e) {
          return
        } finally {
          this.updateLoading = false
        }
        this.Message('ACTION_SUCCESS')
      })
    }
  }
}
</script>
