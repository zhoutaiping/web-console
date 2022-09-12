<template>
  <CardItemForm
    :is-init="isInit"
    :is-support="isSupport"
    :loading="loading"
    title="区域屏蔽"
  >
    <p slot="tips">可根据业务需求，允许或禁止特定区域的终端用户对网站资源的访问</p>
    <yd-form-select
      slot="action"
      :selects="policyGroupOptions"
      v-model="policyGroupStatus"
      @change="handleChangeStatus"
    />
    <DmAlert>
      <p>可根据业务需求，允许或禁止特定区域的终端用户对网站资源的访问</p>
      <p>开启白名单后只允许白名单中地区访问，开启黑名单后只禁止黑名单中 地区访问域名</p>
      <p>支持按国家、省市维度进行配置</p>
      <p>由 <router-link to="./waf">精准访问控制引擎</router-link> 驱动，开启防御后具体防御策略配置请至 <router-link to="./waf">精准访问控制引擎</router-link> 处查看</p>
    </DmAlert>
    <el-form
      v-if="policyGroupStatus === 'open'"
      label-position="left"
      label-width="120px"
    >
      <el-form-item label="屏蔽模式">
        <el-radio-group
          v-model="mode"
          @change="handleChangeMode"
        >
          <el-radio label="white">白名单模式</el-radio>
          <el-radio label="black">黑名单模式</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="选择区域">
        <InputArea
          v-model="data.data"
          style="width: 400px; display: inline-block; margin-right: 12px"
        />
      </el-form-item>
      <!--  -->
      <el-form-item label="启用访问时间控制">
        <el-checkbox v-model="enableTime" />
      </el-form-item>
      <el-form-item
        v-if="enableTime"
        label="选择时间"
      >
        <InputWeekTime
          v-model="data.timeData"
          style="margin-right: 12px; display: inline-block"
        />
      </el-form-item>
      <el-form-item>
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
import InputArea from '@/components/Input/InputArea'
import InputWeekTime from '@/components/Input/InputWeekTime'
import consoleItem from '../../../../../mixins/consoleItem'
import consolePolicyGroup from '@/mixins/consolePolicyGroup'

export default {
  name: 'CardZoneLimit',

  components: {
    InputArea, InputWeekTime
  },

  mixins: [wafMixins, consoleItem, consolePolicyGroup],

  data() {
    return {
      policyGroupType: 'zL',
      mode: 'white',
      updateLoading: false,
      enableTime: false,
      data: {
        id: '',
        data: [],
        timeData: {
          weeks: [],
          req_time: ''
        }
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
            rule_type: 'region'
          }
        ]
      }

      if (this.enableTime) {
        data.rules.push({
          data: form.timeData,
          logic: form.logic,
          rule_type: 'req_time'
        })
      }
      return data
    },

    async handleChangeStatus() {
      await this.confirmAction()
      await this.handleChangePolicyGroupStatus()
      this.$nextTick(() => {
        this.fetchData()
      })
    },

    async fetchData() {
      const data = {
        id: '',
        logic: 'not_belongs',
        data: [],
        timeData: {
          weeks: [],
          req_time: ''
        }
      }
      const res = await this.Fetch.get('V4/firewall.policy.get_groupId', {
        group_id: this.wafGroupIds[this.policyGroupType]
      })
      const { list = [] } = res

      const ruleData = list[0]
      if (ruleData) {
        const { rules = [] } = ruleData
        data.id = ruleData.id

        rules.forEach(item => {
          const { rule_type, logic } = item
          this.mode = logic === 'not_belongs' ? 'white' : 'black'
          data.logic = logic
          if (rule_type === 'region') {
            data.data = item.data
          } else {
            data.timeData = item.data
            this.enableTime = true
          }
        })
      }
      this.data = data
    },
    // 切换黑白模式
    async handleChangeMode() {
      const data = this.data
      data.logic = this.mode === 'white' ? 'not_belongs' : 'belongs'
    },

    async handleUpdate() {
      await this.confirmAction()
      const data = this.data
      this.updateLoading = true
      try {
        // 删除所有区域
        if (data.data.length === 0) {
          this.policyGroupStatus = 'off'
          this.handleChangePolicyGroupStatus()
          if (data.id) await this.Fetch.post('V4/firewall.policy.delete', { ids: [data.id] })
        } else {
          await this.Fetch.post('V4/firewall.policy.save', this.formatRuleData(data))
        }
      } catch (e) {
        return
      } finally {
        this.updateLoading = false
      }

      this.Message('ACTION_SUCCESS')
      this.fetchData()
    }
  }
}
</script>
